/** 
Copyright (c) 2017 Hiroshi Takase.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */

// Process {ruby base|ruby text}

"use strict";

import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";

function ddmd_ruby(state: StateInline, silent: boolean) {
  var token,
    tokens: Token[],
    max = state.posMax,
    start = state.pos,
    devPos,
    closePos,
    baseText,
    rubyText;

  if (silent) {
    return false;
  }
  if (state.src.charCodeAt(start) !== 0x7b /* { */) {
    return false;
  }
  if (start + 4 >= max) {
    return false;
  }

  state.pos = start + 1;

  while (state.pos < max) {
    if (devPos) {
      if (
        state.src.charCodeAt(state.pos) === 0x7d /* } */ &&
        state.src.charCodeAt(state.pos - 1) !== 0x5c /* \ */
      ) {
        closePos = state.pos;
        break;
      }
    } else if (
      state.src.charCodeAt(state.pos) === 0x7c /* | */ &&
      state.src.charCodeAt(state.pos - 1) !== 0x5c /* \ */
    ) {
      devPos = state.pos;
    }

    state.pos++;
  }

  if (!closePos || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  state.posMax = state.pos;
  state.pos = start + 1;

  token = state.push("ruby_open", "ruby", 1);
  token.markup = "{";

  baseText = state.src.slice(start + 1, devPos);
  rubyText = state.src.slice((devPos ?? 0) + 1, closePos);
  token.content = rubyText;

  state.md.inline.parse(baseText, state.md, state.env, (tokens = []));

  tokens.forEach(function (t) {
    state.tokens.push(t);
  });

  token = state.push("ruby_close", "ruby", -1);
  token.markup = "}";

  state.pos = state.posMax + 1;
  state.posMax = max;

  return true;
}

export default function ruby_plugin(md: MarkdownIt) {
  md.inline.ruler.before("text", "ddmd_ruby", ddmd_ruby);
}

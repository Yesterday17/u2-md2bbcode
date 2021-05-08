import markdown from "markdown-it";
import container from "markdown-it-container";
import { RenderRule } from "markdown-it/lib/renderer";

export const md = markdown("commonmark", {
  html: false,
  xhtmlOut: false,
  linkify: true,
  breaks: true,
});

// heading
md.renderer.rules["heading_open"] = (tokens, idx) =>
  `[size=${8 - Number(tokens[idx].tag.substr(1))}]`;
md.renderer.rules["heading_close"] = () => "[/size]\n";

// code
md.renderer.rules.code_inline = function (tokens, idx) {
  const token = tokens[idx];
  return `[pre]${md.utils.escapeHtml(token.content)}[/pre]`;
};
const renderCode: RenderRule = (tokens, idx) => {
  const token = tokens[idx];
  return "[code]" + md.utils.escapeHtml(token.content) + "[/code]\n";
};
md.renderer.rules.code_block = renderCode;
md.renderer.rules.fence = renderCode;

const closeList = [
  "blockquote_close",
  "container_spoiler_close",
  "container_quote_close",
  "container_info_close",
  "container_mediainfo_close",
  "container_pre_close",
];
md.renderer.rules.hardbreak = () => "\n";
md.renderer.rules.softbreak = () => "\n";
md.renderer.rules["paragraph_open"] = () => "";
md.renderer.rules["paragraph_close"] = (tokens, idx) => {
  const token = tokens[idx];
  const next = tokens[idx + 1];
  if (token.hidden) {
    return "\n";
  } else if (next && closeList.includes(next.type)) {
    return "";
  } else {
    return "\n\n";
  }
};
md.renderer.rules["blockquote_open"] = () => "[quote]";
md.renderer.rules["blockquote_close"] = () => "[/quote]\n";
md.renderer.rules["hr"] = () => "--------------------\n";

// list
md.renderer.rules["ordered_list_open"] = (tokens, idx, options, env) => {
  env.order = 1;
  return "";
};
md.renderer.rules["bullet_list_open"] = () => "";
md.renderer.rules["list_item_open"] = (tokens, idx, options, env) => {
  if (env.order) {
    return `${env.order++}. `;
  } else {
    return "[*]";
  }
};
md.renderer.rules["list_item_close"] = () => "";
md.renderer.rules["ordered_list_close"] = (tokens, idx, options, env) => {
  delete env.order;
  return "\n";
};
md.renderer.rules["bullet_list_close"] = () => "\n";

md.renderer.rules["strong_open"] = () => "[b]";
md.renderer.rules["strong_close"] = () => "[/b]";
md.renderer.rules["em_open"] = (tokens, idx) =>
  tokens[idx].markup === "_" ? "[u]" : "[i]";
md.renderer.rules["em_close"] = (tokens, idx) =>
  tokens[idx].markup === "_" ? "[/u]" : "[/i]";
md.renderer.rules["s_open"] = () => "[s]";
md.renderer.rules["s_close"] = () => "[/s]";

// image
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx];
  if (token.content === "link") {
    return `[imglnk]${tokens[idx].attrGet("src")}[/imglnk]`;
  } else {
    return `[img]${tokens[idx].attrGet("src")}[/img]`;
  }
};

// link
md.renderer.rules["link_open"] = (tokens, idx) => {
  return `[url=${tokens[idx].attrGet("href")}]`;
};
md.renderer.rules["link_close"] = () => "[/url]";

md.use(container, "spoiler", {
  validate: (params: string) => {
    return params.trim().match(/^(?:spoiler|fold)\s*(.*)?$/);
  },
  render: function (tokens: any[], idx: number) {
    var m = tokens[idx].info.trim().match(/^(?:spoiler|fold)\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      if (m) {
        return `[spoiler="${m[1]}"]`;
      } else {
        return "[spoiler]";
      }
    } else {
      return "[/spoiler]\n\n";
    }
  },
});

md.use(container, "quote", {
  validate: (params: string) => {
    return params.trim().match(/^quote\s*(.*)?$/);
  },
  render: function (tokens: any[], idx: number) {
    var m = tokens[idx].info.trim().match(/^quote\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      if (m) {
        return `[quote="${m[1]}"]`;
      } else {
        return "[quote]";
      }
    } else {
      return "[/quote]\n\n";
    }
  },
});

md.use(container, "info", {
  validate: (params: string) => {
    return params.trim().match(/^info\s*$/);
  },
  render: function (tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return `[info]`;
    } else {
      return "[/info]\n\n";
    }
  },
});

md.use(container, "mediainfo", {
  validate: (params: string) => {
    return params.trim().match(/^media(info)?\s*$/);
  },
  render: function (tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return `[mediainfo]`;
    } else {
      return "[/mediainfo]\n\n";
    }
  },
});

md.use(container, "pre", {
  validate: (params: string) => {
    return params.trim().match(/^pre\s*$/);
  },
  render: function (tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return `[pre]`;
    } else {
      return "[/pre]\n\n";
    }
  },
});

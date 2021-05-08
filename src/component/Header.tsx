import * as React from "react";

import * as Hooks from "../hooks";

import * as Core from "@material-ui/core";
import * as Icons from "@material-ui/icons";

interface HeaderProps {
  configCollector(): {
    text: string;
  };
}

function Header(props: HeaderProps) {
  const { title, toolbar } = Hooks.useHeaderStyles();
  return (
    <Core.AppBar position="fixed">
      <Core.StylesProvider injectFirst={true}>
        <Core.Toolbar className={toolbar}>
          <Core.Typography variant="h5" className={title}>
            <Title />
          </Core.Typography>
          <CopyOutput text={() => props.configCollector()["text"]} />
        </Core.Toolbar>
      </Core.StylesProvider>
    </Core.AppBar>
  );
}

function Title(props: {}) {
  const isSmall = !Core.useMediaQuery("@media (min-width: 768px)");
  const { titleSuffixSmall } = Hooks.useHeaderStyles();
  return isSmall ? (
    <div className={titleSuffixSmall}>Markdown To U2 BBCode Converter</div>
  ) : (
    <span>Markdown To U2 BBCode Converter</span>
  );
}

function CopyOutput(props: { text: () => string }) {
  const [open, reset] = Hooks.useClipboard(`#mm2bc-copy-output`, props.text);
  const isSmall = !Core.useMediaQuery("@media (min-width: 1024px)");
  const clipboardMessage = "BBCode output successfully copied";
  return isSmall ? (
    <div>
      <Core.IconButton color="inherit" id="mm2bc-copy-output">
        <Icons.FileCopy />
      </Core.IconButton>
      <Core.Snackbar
        open={open}
        autoHideDuration={4096}
        message={clipboardMessage}
        onClose={reset}
      />
    </div>
  ) : (
    <div>
      <Core.Button color="inherit" id="mm2bc-copy-output">
        <Icons.FileCopy />
        &nbsp;Copy Output
      </Core.Button>
      <Core.Snackbar
        open={open}
        autoHideDuration={4096}
        message={clipboardMessage}
        onClose={reset}
      />
    </div>
  );
}

export default Header;

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Styles from "@material-ui/core/styles";

import Main from "./component/Main";
import Header from "./component/Header";

import { md } from "./markdown";

export interface RenderConfigItem {
  [key: string]: {
    prefix: string;
    suffix: string;
  };
}

const textObject = { text: "" };

const muiTheme = Styles.createMuiTheme({
  palette: {
    primary: {
      main: "#2e7d32",
    },
    secondary: {
      main: "#2e7d32",
    },
  },
});

const renderConfigItem: RenderConfigItem = {};

function collectConfig(preset?: string) {
  return { renderer: renderConfigItem, text: textObject.text };
}

function onTransform(markdownText: string) {
  return (textObject.text = md.render(markdownText));
}

function body() {
  return (
    <Styles.MuiThemeProvider theme={muiTheme}>
      <Header configCollector={collectConfig} />
      <Main transformer={onTransform} />
    </Styles.MuiThemeProvider>
  );
}

ReactDOM.render(body(), document.body);

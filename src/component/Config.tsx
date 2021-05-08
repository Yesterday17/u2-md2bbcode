import * as React from "react";

import * as Index from "../index";
import * as Hooks from "../hooks";

import * as Core from "@material-ui/core";
import * as Icons from "@material-ui/icons";

import * as PopupState from "material-ui-popup-state/hooks";
import { useTheme } from "@material-ui/core";

interface ConfigProps {
  configCollector(): {
    renderer: Index.RenderConfigItem;
    text: string;
  };
}

function Config(props: ConfigProps) {
  const popupState = PopupState.usePopupState({
    variant: "popover",
    popupId: "config",
  });

  const [renderConfigOpen, setRenderConfigOpen] = React.useState(false);

  const [aboutConfigOpen, setAboutConfigOpen] = React.useState(false);

  const collectRendererConfig = () => props.configCollector()["renderer"];

  const { pre } = Hooks.useRootStyles();

  const theme = useTheme();

  const generateRenderConfigList = () => {
    const result = [];
    const rendererConfig = collectRendererConfig();
    for (const key in rendererConfig) {
      const { prefix, suffix } = rendererConfig[key];
      result.push(
        <div key={key} style={{ margin: "2em 0" }}>
          <h3 style={{ fontWeight: 500 }}>{key}</h3>
          <pre className={pre}>{prefix + "`" + suffix + "`"}</pre>
        </div>
      );
    }
    return result;
  };

  const closeRenderConfig = () => setRenderConfigOpen(false);

  const closeAboutConfig = () => setAboutConfigOpen(false);

  return (
    <div style={{ display: "inline-block" }}>
      <Core.IconButton
        color="inherit"
        style={{ marginRight: -theme.spacing(1.5) }}
        {...PopupState.bindTrigger(popupState)}
      >
        <Icons.MoreVert />
      </Core.IconButton>
      <ConfigMenu
        popupState={popupState}
        onAboutClick={() => setAboutConfigOpen(true)}
        onRenderConfigClick={() => setRenderConfigOpen(true)}
      />
      <Core.Dialog
        fullWidth={true}
        scroll="paper"
        open={renderConfigOpen}
        onClose={closeRenderConfig}
        title="Render Configuration"
      >
        <Core.DialogContent>{generateRenderConfigList()}</Core.DialogContent>
        <Core.DialogActions>
          <Core.Button color="primary" onClick={closeRenderConfig}>
            OK
          </Core.Button>
        </Core.DialogActions>
      </Core.Dialog>
      <Core.Dialog
        scroll="paper"
        open={aboutConfigOpen}
        onClose={closeAboutConfig}
        title="About Project"
      >
        <Core.DialogContent>
          <p>
            Author:&nbsp;zzzz (Github:&nbsp;
            <AuthorGitHub />
            ,&nbsp;MCBBS:&nbsp;
            <AuthorMCBBS />
            ).
          </p>
          <p>
            Source Code on <SourceCodeGitHub />, under <SourceCodeLicense />.
          </p>
          <p>
            Powered by <ByReact /> and <ByMaterialUI />.
          </p>
        </Core.DialogContent>
        <Core.DialogActions>
          <Core.Button color="primary" onClick={closeAboutConfig}>
            OK
          </Core.Button>
        </Core.DialogActions>
      </Core.Dialog>
    </div>
  );
}

interface WatchingProps {
  images: {
    [key: string]: string;
  };
}

interface ConfigMenuProps {
  popupState: PopupState.PopupState;
  onRenderConfigClick(): void;
  onAboutClick(): void;
}

function ConfigMenu(props: ConfigMenuProps) {
  return (
    <Core.Menu {...PopupState.bindMenu(props.popupState)}>
      <Core.MenuItem onClick={props.onRenderConfigClick}>
        Render Configuration
      </Core.MenuItem>
      <Core.MenuItem onClick={props.onAboutClick}>About Project</Core.MenuItem>
    </Core.Menu>
  );
}

interface AboutLinkProps {
  children: string | React.ReactElement<{}>;
  href: string;
}

function AboutLink(props: AboutLinkProps) {
  const style = { fontWeight: 500, color: "rgba(0, 0, 0, 0.6)" };
  return (
    <a style={style} href={props.href} target="_blank">
      {props.children}
    </a>
  );
}

function AuthorGitHub(props: {}) {
  return <AboutLink href="https://github.com/ustc-zzzz">@ustc-zzzz</AboutLink>;
}

function AuthorMCBBS(props: {}) {
  const href = "https://www.mcbbs.net/?1480882";
  return <AboutLink href={href}>@ustc_zzzz</AboutLink>;
}

function SourceCodeGitHub(props: {}) {
  const href = "https://github.com/ustc-zzzz/mcbbs-markdown2bbcode-converter";
  return <AboutLink href={href}>GitHub</AboutLink>;
}

function SourceCodeLicense(props: {}) {
  const href =
    "https://github.com/ustc-zzzz/mcbbs-markdown2bbcode-converter/blob/master/LICENSE";
  return <AboutLink href={href}>GPL-3.0 License</AboutLink>;
}

function ByReact(props: {}) {
  return <AboutLink href="https://reactjs.org/">React</AboutLink>;
}

function ByMaterialUI(props: {}) {
  return <AboutLink href="https://www.material-ui.com/">Material UI</AboutLink>;
}

function HunluanImg(props: { images: { [key: string]: string } }) {
  return <img height="120px" src={props.images["Hunluan"]} />;
}

function Hunluan(props: { children: React.ReactElement<{}> }) {
  const href = "https://www.mcbbs.net/?3038";
  return <AboutLink href={href}>{props.children}</AboutLink>;
}

function Rom718Img(props: { images: { [key: string]: string } }) {
  return <img height="120px" src={props.images["Rom718"]} />;
}

function Rom718(props: { children: React.ReactElement<{}> }) {
  const href = "https://www.mcbbs.net/?265600";
  return <AboutLink href={href}>{props.children}</AboutLink>;
}

function HunluanAndRom718(props: { children: string }) {
  return <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>{props.children}</span>;
}

export default Config;

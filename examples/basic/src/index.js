import * as React from "react";
import ReactDOM from "react-dom";
import { BasicExample } from "./Basic";
import { RenderPropsExample } from "./RenderProps";
import { PortalExample } from "./Portal";
import { FollowCursorExample } from "./FollowCursor";
import { MutationObserverExample } from "./MutationObserver";
import { OutOfBoundariesExample } from "./OutOfBoundaries";


const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <div style={{ height: "200vh" }}>
      <BasicExample />
      <RenderPropsExample />
      <PortalExample />
      <FollowCursorExample />
      <MutationObserverExample />
      <OutOfBoundariesExample />
    </div>
  </React.StrictMode>,
  rootElement
);

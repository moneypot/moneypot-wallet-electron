import "../scss/main.scss";
import "react-toastify/dist/ReactToastify.min.css";
import ReactDOM from "react-dom";

import Overlay from "./components/Overlay";
import React from "react";

const hasURL = localStorage.getItem("walletURL");
if (hasURL === null) {
  throw "invalid url";
}
const hash = hasURL.slice(hasURL.lastIndexOf("#") + 1);
const scriptTag = document.createElement("script");
scriptTag.integrity = `sha256-${hash}`;
scriptTag.src = `${hasURL.slice(0, hasURL.lastIndexOf("#"))}`;
scriptTag.crossOrigin = "Anonymous";
// to keep things clean, we will append it to the page's
// <head /> tag.
document.head.appendChild(scriptTag);

ReactDOM.render(<Overlay></Overlay>, document.getElementById("overlay"));

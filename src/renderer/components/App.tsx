// import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  UncontrolledCollapse,
} from "reactstrap";
import LeftPanel from "./left-panel";

// responsibility of the user for now.
// declare const openpgp: any;

declare const ipcRenderer: any;
declare const window: any;

export default function LoadWallet() {
  const [walletName, setWalletName] = useState(String);
  const [walletURL, setWalletURL] = useState(String);
  useEffect(() => {
    const name = localStorage.getItem("walletName");
    const url = localStorage.getItem("walletURL");

    if (name != null) {
      setWalletName(name);
    }
    if (url != null) {
      setWalletURL(url);
      isNewest(url);
    }
  }, []);

  function openWallet() {
    if (walletURL.lastIndexOf("#") === -1) {
      toast.error("Invalid URL, please recheck it!");
    } else if (!(walletURL.lastIndexOf("#") === -1)) {
      // kinda redundant once a url is set :/
      localStorage.setItem("walletURL", walletURL);
      localStorage.setItem("walletName", walletName);
      ipcRenderer.send("request-mainprocess-action");
      window.close();
    }
  }
  // verify openpgp message of dev for signed wallet url

  const isNewest = async (url: string) => {
    let response = await fetch(
      "https://run.mocky.io/v3/949d110c-8346-4025-a369-e4d4080faef2",
    );
    response = await response.json();
    const value = Object.values(response)[
      Object.keys(response).indexOf("versionScript")
    ];
    value === url
      ? toast.success("It seems like you're running the latest version!")
      : toast.error("this URL might be outdated!");
  };

  return (
    <div className="full-page-container">
      <ToastContainer />
      <LeftPanel />
      <div className="full-page-right-side">
        <h3 className="main-heading">insert new version url!</h3>
        <Form>
          <FormGroup row>
            <Label for="walletName" sm={4}>
              Name
            </Label>
            <Col sm={{ size: 8, offset: 0 }}>
              <Input
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder={walletName}
                type="text"
                name="walletName"
                required
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="versionURL" sm={4}>
              Version URL:
              <br />
              <small id="toggler">What is this?</small>
            </Label>
            <Col sm={{ size: 8, offset: 0 }}>
              <Input
                value={walletURL}
                onChange={(e) => {
                  setWalletURL(e.target.value);
                  isNewest(e.target.value);
                }}
                placeholder={walletURL}
                type="text"
                name="walletURL"
                required
              />
            </Col>
            <UncontrolledCollapse toggler="#toggler">
              <p className="custodian-url-text">
                The version URL is used to ensure you're not loading a malicious
                or tempered-with wallet!
              </p>
            </UncontrolledCollapse>
            <br />
            <hr />
            <small className="text-secondary">
              {" "}
              You can find the latest version URL here:{" "}
              <strong>
                <a
                  href="https://moneypot.com/releases/#latest-url"
                  target="_blank"
                >
                  moneypot.com/releases
                </a>
              </strong>
            </small>
          </FormGroup>
          <FormGroup row>
            <Col className="submit-button-container">
              <Button
                color="success"
                className="btn-moneypot"
                onClick={openWallet}
              >
                Load wallet!
              </Button>
            </Col>
          </FormGroup>
          <small className="text-secondary">
            {" "}
            Please, make sure to verify the URL using our signatures which can
            be found on github:{" "}
            <strong>
              <a
                href="https://github.com/moneypot/moneypot-wallet-dist/releases"
                target="_blank"
              >
                releases
              </a>
            </strong>
          </small>
        </Form>
      </div>
    </div>
  );
}

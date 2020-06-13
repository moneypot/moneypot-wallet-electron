// import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

declare const Mousetrap: any;

export default function Overlay(props: any) {
  const [connectedIP, setconnectedIP] = useState("");
  const [toaster, hasToaster] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const updateModal = () => setopenModal(!openModal);

  const notify = () => toast.info("You can use Shift + K to open the overlay!");

  Mousetrap.bind("shift+k", () => {
    hasToaster(true);
    updateModal();
  });

  async function getIp() {
    const response = await fetch("https://wtfismyip.com/json");
    // {}
    const json = await response.json();
    let x = JSON.stringify(json);
    x = x.replace('"YourFuckingIPAddress":', '"Your IP Adress":');
    x = x.replace('"YourFuckingHostname":', '"Your Hostname":');
    x = x.replace('"YourFuckingISP":', '"Your ISP":');
    x = x.replace('"YourFuckingTorExit":', '"Your TOR Exit":');
    x = x.replace('"YourFuckingCountryCode":', '"Your Country Code":');
    x = x.replace('"YourFuckingLocation":', '"Your Location":');
    hasToaster(true);
    // double stringify for pre
    setconnectedIP(JSON.stringify(JSON.parse(x), null, "\t"));
  }

  toaster === false && notify()

  return (
    <div>
      <ToastContainer />

      <Modal size="lg" isOpen={openModal} className="some-modal">
        <ModalHeader>Overlay....</ModalHeader>
        {connectedIP === "" ? null : <pre>{connectedIP}</pre>}
        <ModalBody>
          Check your ip here!{" "}
          <Button color="success" className="btn-moneypot" onClick={getIp}>
            Request IP!
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              updateModal();
            }}
          >
            Close overlay...
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

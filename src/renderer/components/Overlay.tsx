// import { ipcRenderer } from "electron";
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, InputGroup, InputGroupAddon } from 'reactstrap';

declare const Mousetrap: any;

export default function Overlay(props: any) {
  const [connectedIP, setconnectedIP] = useState('');
  const [openModal, setopenModal] = useState(false);
  const updateModal = () => setopenModal(!openModal);

  const [ToasterInvis, setToasterInvis] = useState(false);
  const updateOneToasterInvis = () => setToasterInvis(!ToasterInvis);

  const [CustomKeys, setCustomKeys] = useState(false);
  const updateCustomKeys = () => setCustomKeys(!CustomKeys);

  const [Bind, setBind] = useState('Shift+K');

  useEffect(() => {
    const loadSett = () => {
      let keys: string | undefined;
      const hasCustomKeys = localStorage.getItem('hasCustomKeys');
      if (hasCustomKeys) {
        if (hasCustomKeys === 'true') {
          setCustomKeys(true);
          const getCustomKeys = localStorage.getItem('getCustomKeys');
          if (getCustomKeys) {
            keys = getCustomKeys;
            setBind(getCustomKeys);
          }
        }
      }
      const toastNotify = () => toast.info(`You can use ${keys === undefined ? Bind : keys} to open the overlay!`);
      const wantToaster = localStorage.getItem('hasToasterInvis');
      if (wantToaster) {
        if (wantToaster === 'true') {
          setToasterInvis(true);
        } else if (wantToaster === 'false') {
          toastNotify();
        }
      } else {
        toastNotify();
      }
    };
    loadSett();
  }, []);

  const applysettings = () => {
    if (ToasterInvis) {
      localStorage.setItem(`hasToasterInvis`, 'true');
    } else if (!ToasterInvis) {
      localStorage.setItem(`hasToasterInvis`, 'false');
    }
    if (CustomKeys) {
      localStorage.setItem('hasCustomKeys', 'true');
      localStorage.setItem('getCustomKeys', Bind); // this will rewrite even if Bind is not changed.
    } else if (!CustomKeys) {
      localStorage.setItem('hasCustomKeys', 'false');
    }
  };

  Mousetrap.bind(Bind, () => {
    updateModal();
  });

  async function getIp() {
    const response = await fetch('https://wtfismyip.com/json');
    // {}
    const json = await response.json();
    let x = JSON.stringify(json);
    x = x.replace('"YourFuckingIPAddress":', '"Your IP Adress":');
    x = x.replace('"YourFuckingHostname":', '"Your Hostname":');
    x = x.replace('"YourFuckingISP":', '"Your ISP":');
    x = x.replace('"YourFuckingTorExit":', '"Your TOR Exit":');
    x = x.replace('"YourFuckingCountryCode":', '"Your Country Code":');
    x = x.replace('"YourFuckingLocation":', '"Your Location":');
    // double stringify for pre
    setconnectedIP(JSON.stringify(JSON.parse(x), null, '\t'));
  }

  return (
    <div>
      <ToastContainer />

      <Modal size="lg" isOpen={openModal} className="some-modal">
        <ModalHeader>Overlay....</ModalHeader>
        {connectedIP === '' ? null : <pre>{connectedIP}</pre>}
        <ModalBody>
          {/* Check your ip here!{" "} */}
          <Button color="success" className="btn-moneypot" onClick={getIp}>
            Check IP!
          </Button>
          <Form>
            <FormGroup check>
              <Label check>
                <Input id="setting_1" type="checkbox" onChange={updateOneToasterInvis} checked={ToasterInvis} /> Hide the Shift + K toaster on start-up.
              </Label>
              <Label check>
                <Input id="setting_2" type="checkbox" onChange={updateCustomKeys} checked={CustomKeys} /> Set a special shortcut to open the overlay. (Default
                is Shift + K)
              </Label>
              <InputGroup>
                <Input placeholder={Bind} type="text" onChange={(e) => setBind(e.target.value)} />
              </InputGroup>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              updateModal();
              applysettings();
            }}
          >
            Close overlay...
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

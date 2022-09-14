/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// basic attributes that can be added to NFT
const EMOTION = ["Sad", "Happy", "Anxious"];


const AddNfts = ({ save, address }) => {
  const [secret, setSecret] = useState("");
  const [price, setPrice] = useState("")

  //store attributes of an NFT
  const [attributes, setAttributes] = useState([]);
  const [show, setShow] = useState(false);


  // check if all form data has been filled
  const isFormFilled = () =>{
   return secret && attributes.length > 0;
  }
      

  // close the popup modal
  const handleClose = () => {
    setShow(false);
    setAttributes([]);
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  // add an attribute to an NFT
  const setAttributesFunc = (e, trait_type) => {
    const {value} = e.target;
    const attributeObject = {
      trait_type,
      value,
    };
    const arr = attributes;

    // check if attribute already exists
    const index = arr.findIndex((el) => el.trait_type === trait_type);

    if (index >= 0) {

      // update the existing attribute
      arr[index] = {
        trait_type,
        value,
      };
      setAttributes(arr);
      return;
    }

    // add a new attribute
    setAttributes((oldArray) => [...oldArray, attributeObject]);
  };

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tell Your Secret</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <FloatingLabel
              controlId="inputDescription"
              label="Secret"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Secret"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setSecret(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputLocation"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Price of NFT"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>

            
            <Form.Label>
              <h5>Properties</h5>
            </Form.Label>
            <Form.Control
              as="select"
              className={"mb-3"}
              onChange={async (e) => {
                setAttributesFunc(e, "emotions");
              }}
              placeholder="What is the emotion"
            >
              <option hidden>Emotions</option>
              {EMOTION.map((emotion) => (
                <option
                  key={`emotions-${emotion.toLowerCase()}`}
                  value={emotion.toLowerCase()}
                >
                  {emotion}
                </option>
              ))}
            </Form.Control>
            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                price,
                secret,
                ownerAddress: address,
                attributes,
              });
              handleClose();
            }}
          >
            Create Secret
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {

  // props passed into this component
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;

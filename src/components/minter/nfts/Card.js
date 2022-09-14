import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Row } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import { Form, Button } from "react-bootstrap";
import Identicon from "../../ui/Identicon";

const NftCard = ({ nft, send, contractOwner, ownSecret, disownSecret }) => {
  const {  secret, owner, index, price, attributes, sold } =
    nft;
  const handleSend = (index, owner) => {
    if (!sendAddrss) alert('Please input an address');
    send(sendAddrss, index, owner);
  };
  const [sendAddrss, setSendAddrss] = useState("");
  {
    console.log(sold);
  }
  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {price / 10 ** 18} CELO
            </Badge>
          </Stack>
        </Card.Header>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Text className="flex-grow-1">{secret}</Card.Text>
          <div>
            <Row className="mt-2">
              {attributes.map((attribute, key) => (
                <Col key={key}>
                  <div className="border rounded bg-light">
                    <div className="text-secondary fw-lighter small text-capitalize">
                      {attribute.trait_type}
                    </div>
                    <div className="text-secondary text-capitalize font-monospace">
                      {attribute.value}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          {contractOwner === owner && (
            <>
              <Form.Control
                className={"pt-2"}
                type="text"
                placeholder="Send Address"
                onChange={(e) => {
                  setSendAddrss(e.target.value);
                }}
              />
              <Button
                variant="secondary"
                onClick={() => handleSend(index, owner)}
              >
                Send
              </Button>
            </>
          )}
          {!sold ? (
            <Button variant="secondary" onClick={ownSecret}>
              Buy
            </Button>
          ) : contractOwner === owner ? (
            <Button variant="danger" onClick={disownSecret}>
              Sell
            </Button>
          ) : (
            <Button variant="outline-danger" disabled>
            Sold
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;

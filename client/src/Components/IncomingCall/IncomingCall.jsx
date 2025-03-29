import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { ChatContext } from "../../Chat_Context";
import socket from "../../config/socket";

function IncomingCall(props) {
  const { answerCall, ring, callerId, rejectCall } = useContext(ChatContext);

  useEffect(() => {
    ring.current.loop = true;
    ring.current.play();
  }, []);

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      size="sm"
    >
      <Card border="light">
        <Card.Img variant="top" />
        <Card.Body>
          <Card.Title>Incoming call from Vishal</Card.Title>
          <Button variant="success" onClick={() => answerCall(callerId)}>
            Answer
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="danger" onClick={() => rejectCall()}>
            Reject
          </Button>
        </Card.Body>
      </Card>
    </Modal>
  );
}

export default memo(IncomingCall);

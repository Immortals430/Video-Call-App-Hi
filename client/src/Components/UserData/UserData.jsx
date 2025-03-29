import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
import "./userdata.scss";
import { memo, useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Chat_Context";
import dp1 from "../../assets/dp1.png";
import dp2 from "../../assets/dp2.png";

import Image from "react-bootstrap/Image";

function UserData(props) {
  const { setLoggedUser } = useContext(ChatContext);
  const [myNameInput, setMyNameInput] = useState("");
  const [avatar, setAvatar] = useState("");
  const [notValidUsername, setNotValidUsername] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState();

  useEffect(() => {
    return () => clearTimeout(alertTimeout);
  });

  // hnadle btn click
  const handleClick = () => {
    if (!avatar || myNameInput.length === 0) {
      setNotValidUsername(true);
      const timeout = setTimeout(() => {
        setNotValidUsername(false);
      }, 3000);
      setAlertTimeout(timeout);
    } else {
      props.onHide();
      setLoggedUser({
        myUsername: myNameInput,
        avatar,
        myUserId: crypto.randomUUID(),
      });
    }
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Enter you Username to start Video Call
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="mb-4">
            <Col xs={6} md={4}>
              <Image
                src={dp1}
                roundedCircle
                className={`avatar-options border ${
                  avatar.includes("dp1") ? "active" : null
                }`}
                onClick={() => setAvatar(dp1)}
              />
            </Col>

            <Col xs={6} md={4}>
              <Image
                src={dp2}
                roundedCircle
                className={`avatar-options border ${
                  avatar.includes("dp2") ? "active" : null
                }`}
                onClick={() => setAvatar(dp2)}
              />
            </Col>
          </Row>
        </Container>
        {notValidUsername && (
          <Alert variant={"danger"}> Enter Username and Select Avatar</Alert>
        )}
        <input
          type="text"
          onChange={(e) => setMyNameInput(e.target.value)}
          placeholder="Vishal Kumar"
          className="username-input mb-3"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClick}>Connect</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default memo(UserData);

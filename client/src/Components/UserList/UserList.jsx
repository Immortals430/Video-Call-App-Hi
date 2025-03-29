import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "./userlist.scss";
import { memo, useContext } from "react";
import { ChatContext } from "../../Chat_Context";
import React from "react";

function UserList() {
  const { loggedUser, onlineUsers, callUser } = useContext(ChatContext);

  return (
    <Container>
      <h4>OnlineUsers</h4>

      <Row className="justify-content-center">
        {loggedUser ? (
          <Col lg={3} md={4} sm={6} className="my-3">
            <Card>
              <Card.Img variant="top" src={loggedUser.avatar} />
              <Card.Body>
                <Card.Title>Your Profile</Card.Title>
                <Card.Title className="text-primary font-weight-bold"></Card.Title>
                <Button variant="disabled">{loggedUser.myUsername}</Button>
              </Card.Body>
            </Card>
          </Col>
        ) : null}

        {onlineUsers.map((obj, i) =>
          obj.userId != loggedUser.myUserId ? (
            <Col lg={3} md={4} sm={6} className="my-3" key={i}>
              <Card>
                <Card.Img variant="top" src={obj.avatar} />
                <Card.Body>
                  <Card.Title>{obj.username}</Card.Title>

                  <Button
                    variant="success"
                    onClick={() => callUser(loggedUser.myUserId, obj.userId)}
                  >
                    Call {obj.username}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ) : null
        )}
      </Row>
    </Container>
  );
}

export default memo(UserList);

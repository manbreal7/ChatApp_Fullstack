import React from "react";
import { Container, Row, Col } from "reactstrap";

const ChatShimmer = () => {
  return (
    <Container fluid>
      {Array(10)
        .fill("")
        .map((_, idx) => (
          <Row
            key={idx}
            className="align-items-center p-2 my-2 border rounded bg-secondary bg-opacity-10 shimmer-animated"
          >
            <Col xs="2">
              <div className="rounded-circle bg-light shimmer-animation" style={{ width: "50px", height: "50px" }}></div>
            </Col>
            <Col xs="10">
              <div className="bg-light shimmer-animation mb-2 rounded" style={{ height: "10px", width: "75%" }}></div>
              <div className="bg-light shimmer-animation rounded" style={{ height: "10px", width: "50%" }}></div>
            </Col>
          </Row>
        ))}
    </Container>
  );
};

export const ChatShimmerSmall = () => {
  return (
    <Container fluid>
      {Array(10)
        .fill("")
        .map((_, idx) => (
          <Row
            key={idx}
            className="align-items-center p-2 my-2 border rounded bg-secondary bg-opacity-10 shimmer-animated"
          >
            <Col xs="2">
              <div className="rounded-circle bg-light shimmer-animation" style={{ width: "40px", height: "40px" }}></div>
            </Col>
            <Col xs="8">
              <div className="bg-light shimmer-animation mb-2 rounded" style={{ height: "10px", width: "80%" }}></div>
            </Col>
            <Col xs="2">
              <div className="rounded bg-light shimmer-animation" style={{ width: "30px", height: "30px" }}></div>
            </Col>
          </Row>
        ))}
    </Container>
  );
};

export default ChatShimmer;

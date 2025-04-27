import React from "react";
import { Spinner, Container } from "reactstrap";

const MessageLoading = () => {
	return (
		<Container
			fluid
			className="d-flex justify-content-center align-items-center vh-100"
		>
			<Spinner color="light" style={{ width: "2rem", height: "2rem" }} />
		</Container>
	);
};

export default MessageLoading;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/conditionSlice";
import { Spinner, Button, Container } from "reactstrap";

const Loading = () => {
	const dispatch = useDispatch();
	const [showCancel, setShowCancel] = useState(false);

	useEffect(() => {
		const setId = setTimeout(() => {
			setShowCancel(true);
		}, 10000);
		return () => {
			clearTimeout(setId);
		};
	}, []);

	return (
		<Container
			fluid
			className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark bg-opacity-75 text-light position-fixed top-0 w-100"
			style={{ zIndex: 1050 }}
		>
			<Spinner color="primary" style={{ width: "4rem", height: "4rem" }} />
			{showCancel && (
				<Button
					color="danger"
					className="mt-4"
					onClick={() => dispatch(setLoading(false))}
				>
					Cancel
				</Button>
			)}
		</Container>
	);
};

export default Loading;

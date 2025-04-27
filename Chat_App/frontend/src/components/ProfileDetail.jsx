import React from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, Button, Card, CardBody, Row, Col } from "reactstrap";

const ProfileDetail = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.auth);

	const handleUpdate = () => {
		toast.warn("Feature coming soon!");
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<Modal isOpen={true} toggle={() => dispatch(setProfileDetail())} centered>
			<ModalHeader toggle={() => dispatch(setProfileDetail())} className="bg-dark text-white">
				Profile Details
			</ModalHeader>
			<ModalBody className="bg-secondary text-white p-4">
				<Card className="border-0 bg-dark text-white shadow-lg p-3">
					<CardBody className="text-center">
						<img
							src={user.image}
							alt="User Profile"
							className="rounded-circle border border-light mb-3"
							width="120"
							height="120"
						/>
						<h3 className="fw-bold">{user.firstName} {user.lastName}</h3>
						<p className="text-light mb-3">{user.email}</p>

						<Row className="mt-4">
							<Col xs="12" md="6" className="mb-2">
								<Button color="primary" className="w-100 fw-bold" onClick={handleUpdate}>
									Update Profile
								</Button>
							</Col>
							<Col xs="12" md="6">
								<Button color="danger" className="w-100 fw-bold" onClick={handleLogout}>
									Logout
								</Button>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</ModalBody>
		</Modal>
	);
};

export default ProfileDetail;

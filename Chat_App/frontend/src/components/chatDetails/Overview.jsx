import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import { CiCircleInfo } from "react-icons/ci";
import { toast } from "react-toastify";
import { RxUpdate } from "react-icons/rx";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setLoading } from "../../redux/slices/conditionSlice";
import { Container, Row, Col, Button, Input, FormGroup, Label } from "reactstrap";

const Overview = () => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [changeNameBox, setChangeNameBox] = useState(false);
	const [changeName, setChangeName] = useState(selectedChat?.chatName);

	const handleShowNameChange = () => {
		if (authUserId === selectedChat?.groupAdmin?._id) {
			setChangeNameBox(!changeNameBox);
			setChangeName(selectedChat?.chatName);
		} else {
			toast.warn("You're not admin");
		}
	};

	const handleChangeName = () => {
		setChangeNameBox(false);
		if (selectedChat?.chatName === changeName.trim()) {
			toast.warn("Name already taken");
			return;
		} else if (!changeName.trim()) {
			toast.warn("Please enter group name");
			return;
		}
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: changeName.trim(),
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
				toast.success("Group name changed");
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<Container fluid className="bg-dark p-3">
			<Row className="mb-3 flex items-center px-">
				<Col>
					<img
						src={getChatImage(selectedChat, authUserId)}
						alt="Chat"
						className="rounded-circle border border-secondary"
						style={{ height: "75px", width: "75px" }}
					/>
				</Col>
				<Col>
					<h4 className="d-flex align-items-center justify-content-center gap-2 w-36 text-xl font-semibold">
						{getChatName(selectedChat, authUserId)}
						{selectedChat?.isGroupChat && (
							<CiCircleInfo
								fontSize={25}
								title="Change Name"
								className="text-primary cursor-pointer"
								onClick={handleShowNameChange}
							/>
						)}
					</h4>
				</Col>
			</Row>

			{/* Rename Group Chat */}
			{changeNameBox && (
				<Row className="mb-3">
					<Col>
						<FormGroup>
							<Label>Rename Group Chat:</Label>
							<div className="d-flex gap-2">
								<Input
									type="text"
									value={changeName}
									onChange={(e) => setChangeName(e.target.value)}
									className="border border-secondary"
								/>
								<Button color="primary" title="Change Name" onClick={handleChangeName}>
									<RxUpdate size={20} />
								</Button>
							</div>
						</FormGroup>
					</Col>
				</Row>
			)}

			<hr />

			{/* Chat Details */}
			<Row>
				<Col>
					<h6 className="mt-3 font-semibold">Created</h6>
					<p className="text-gray-300">{SimpleDateAndTime(selectedChat?.createdAt)}</p>
				</Col>
			</Row>
			<Row>
				<Col>
					<h6 className="mt-3 font-semibold">Last Updated</h6>
					<p className="text-gray-300">{SimpleDateAndTime(selectedChat?.updatedAt)}</p>
				</Col>
			</Row>
			<Row>
				<Col>
					<h6 className="mt-3 font-semibold">Last Message</h6>
					<p className="text-gray-300">{SimpleDateAndTime(selectedChat?.latestMessage?.updatedAt)}</p>
				</Col>
			</Row>
		</Container>
	);
};

export default Overview;

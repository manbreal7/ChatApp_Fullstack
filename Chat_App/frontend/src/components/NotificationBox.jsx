import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedChat, removeNewMessageRecieved } from "../redux/slices/myChatSlice";
import { setNotificationBox } from "../redux/slices/conditionSlice";
import { MdOutlineClose } from "react-icons/md";
import { SimpleDateAndTime } from "../utils/formateDateTime";
import getChatName from "../utils/getChatName";
import { Modal, ModalHeader, ModalBody, Button, ListGroup, ListGroupItem, Badge } from "reactstrap";

const NotificationBox = () => {
	const authUserId = useSelector((store) => store?.auth?._id);
	const dispatch = useDispatch();
	const newMessageRecieved = useSelector((store) => store?.myChat?.newMessageRecieved);

	const closeModal = () => dispatch(setNotificationBox(false));

	return (
		<Modal isOpen={true} toggle={closeModal} centered>
			<ModalHeader toggle={closeModal}>Notifications</ModalHeader>
			<ModalBody className="bg-dark text-white">
				{newMessageRecieved.length > 0 ? (
					<p className="text-center">You have {newMessageRecieved.length} new notifications</p>
				) : (
					<p className="text-center">You have no new notifications</p>
				)}

				<ListGroup className="overflow-auto" style={{ maxHeight: "50vh" }}>
					{newMessageRecieved?.map((message) => (
						<ListGroupItem
							key={message?._id}
							className="d-flex justify-content-between align-items-center list-group-item-action bg-secondary text-white"
							onClick={() => {
								dispatch(removeNewMessageRecieved(message));
								dispatch(addSelectedChat(message?.chat));
								dispatch(setNotificationBox(false));
							}}
						>
							<div>
								<strong>
									New message{" "}
									{message?.chat?.isGroupChat && `in ${getChatName(message?.chat, authUserId)}`} from {message?.sender?.firstName}:
								</strong>{" "}
								<span className="text-success">{message?.message}</span>
								<div className="text-light small">{SimpleDateAndTime(message?.createdAt)}</div>
							</div>
							<Badge color="danger">New</Badge>
						</ListGroupItem>
					))}
				</ListGroup>
				<div className="d-flex justify-content-center mt-3">
					<Button color="danger" onClick={closeModal} className="flex flex-row items-center">
						Close
					</Button>
				</div>
			</ModalBody>
		</Modal>
	);
};

export default NotificationBox;

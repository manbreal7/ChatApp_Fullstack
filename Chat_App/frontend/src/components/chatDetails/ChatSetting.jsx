import React from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	setChatDetailsBox,
	setLoading,
} from "../../redux/slices/conditionSlice";
import { addAllMessages } from "../../redux/slices/messageSlice";
import { deleteSelectedChat } from "../../redux/slices/myChatSlice";
import socket from "../../socket/socket";
import { Container, Card, CardBody, Button } from "reactstrap";

const ChatSetting = () => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);

	const handleClearChat = () => {
		if (authUserId === selectedChat?.groupAdmin?._id || !selectedChat?.isGroupChat) {
			const confirmClear = window.confirm("Are you sure you want to clear this chat?");
			if (confirmClear) {
				handleClearChatCall(); // Proceed with clearing chat
			}
		} else {
			toast.warn("You're not admin");
		}
	};

	const handleDeleteGroup = () => {
		if (authUserId === selectedChat?.groupAdmin?._id) {
			const confirmDeleteGroup = window.confirm("Are you sure you want to delete this group?");
			if (confirmDeleteGroup) {
				handleDeleteChatCall(); // Proceed with deleting group
			}
		} else {
			toast.warn("You're not admin");
		}
	};

	const handleDeleteChat = () => {
		if (!selectedChat?.isGroupChat) {
			const confirmDeleteChat = window.confirm("Are you sure you want to delete this chat?");
			if (confirmDeleteChat) {
				handleDeleteChatCall(); // Proceed with deleting chat
			}
		}
	};

	// Function to clear chat
	const handleClearChatCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message/clearChat/${selectedChat?._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(setLoading(false));
				if (json?.message === "success") {
					dispatch(addAllMessages([]));
					socket.emit("clear chat", selectedChat._id);
					toast.success("Cleared all messages");
				} else {
					toast.error("Failed to clear chat");
				}
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
				toast.error("Failed to clear chat");
			});
	};

	// Function to delete chat or group
	const handleDeleteChatCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/deleteGroup/${selectedChat?._id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then(async (res) => {
				const json = await res.json();
				dispatch(setLoading(false));

				if (res.ok) {
					let chat = selectedChat;
					dispatch(setChatDetailsBox(false));
					dispatch(addAllMessages([]));
					dispatch(deleteSelectedChat(chat._id));
					socket.emit("delete chat", chat, authUserId);

					toast.success("Chat deleted successfully");
				} else {
					toast.error(json?.message || "Failed to delete chat");
				}
			})

	};

	return (
		<Container className="p-3 text-white">
			<h1 className="text-center mb-3">Settings</h1>

			{/* Clear Chat */}
			<Card className="mb-2 bg-dark text-white cursor-pointer">
				<CardBody className="d-flex justify-content-between align-items-center" onClick={handleClearChat}>
					<h5 className="m-0">Clear Chat</h5>
					<CiCircleInfo size={20} />
				</CardBody>
			</Card>

			{/* Delete Chat or Group */}
			{selectedChat?.isGroupChat ? (
				<Card className="bg-danger text-white cursor-pointer">
					<CardBody className="d-flex justify-content-between align-items-center" onClick={handleDeleteGroup}>
						<h5 className="m-0">Delete Group</h5>
						<CiCircleInfo size={20} />
					</CardBody>
				</Card>
			) : (
				<Card className="bg-danger text-white cursor-pointer">
					<CardBody className="d-flex justify-content-between align-items-center" onClick={handleDeleteChat}>
						<h5 className="m-0">Delete Chat</h5>
						<CiCircleInfo size={20} />
					</CardBody>
				</Card>
			)}
		</Container>
	);
};

export default ChatSetting;

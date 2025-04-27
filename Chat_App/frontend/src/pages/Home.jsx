import { useEffect } from "react";
import { MdChat } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import {
	setChatDetailsBox,
	setSocketConnected,
	setUserSearchBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
	addNewChat,
	addNewMessageRecieved,
	deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { toast } from "react-toastify";
import { receivedSound } from "../utils/notificationSound";

let selectedChatCompare;

const Home = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const dispatch = useDispatch();
	const isUserSearchBox = useSelector((store) => store?.condition?.isUserSearchBox);
	const authUserId = useSelector((store) => store?.auth?._id);

	// Setup socket
	useEffect(() => {
		if (!authUserId) return;
		socket.emit("setup", authUserId);
		socket.on("connected", () => dispatch(setSocketConnected(true)));
	}, [authUserId]);

	// Handle incoming messages
	useEffect(() => {
		selectedChatCompare = selectedChat;

		const messageHandler = (newMessageReceived) => {
			if (
				selectedChatCompare &&
				selectedChatCompare._id === newMessageReceived.chat._id
			) {
				dispatch(addNewMessage(newMessageReceived));
			} else {
				receivedSound();
				dispatch(addNewMessageRecieved(newMessageReceived));
			}
		};

		socket.on("message received", messageHandler);
		return () => socket.off("message received", messageHandler);
	}, [selectedChat]);

	// Clear chat
	useEffect(() => {
		const clearChatHandler = (chatId) => {
			if (chatId === selectedChat?._id) {
				dispatch(addAllMessages([]));
				toast.success("Cleared all messages");
			}
		};
		socket.on("clear chat", clearChatHandler);
		return () => socket.off("clear chat", clearChatHandler);
	}, [selectedChat]);

	// Delete chat
	useEffect(() => {
		const deleteChatHandler = (chatId) => {
			dispatch(setChatDetailsBox(false));
			if (selectedChat && chatId === selectedChat._id) {
				dispatch(addAllMessages([]));
			}
			dispatch(deleteSelectedChat(chatId));
			toast.success("Chat deleted successfully");
		};
		socket.on("delete chat", deleteChatHandler);
		return () => socket.off("delete chat", deleteChatHandler);
	}, [selectedChat]);

	// New chat created
	useEffect(() => {
		const chatCreatedHandler = (chat) => {
			dispatch(addNewChat(chat));
			toast.success("Created & Selected chat");
		};
		socket.on("chat created", chatCreatedHandler);
		return () => socket.off("chat created", chatCreatedHandler);
	}, []);

	return (
		<div className="flex flex-col sm:flex-row w-full h-[84vh] bg-slate-900 rounded-md shadow-md overflow-hidden">

			{/* Left Sidebar */}
			<div
				className={`${selectedChat ? "hidden sm:flex" : "flex"
					} sm:w-[35%] w-full h-full flex-col relative bg-slate-800`}
			>
				<div className="flex-1 overflow-y-auto">
					{isUserSearchBox ? <UserSearch /> : <MyChat />}
				</div>
				<div className="absolute bottom-8 right-8 border rounded-lg p-2 text-white z-10">
					<MdChat
						title="New Chat"
						size={32}
						className="cursor-pointer hover:text-green-400 transition"
						onClick={() => dispatch(setUserSearchBox())}
					/>
				</div>
			</div>

			{/* Right Message Section */}
			<div
				className={`${selectedChat ? "flex" : "hidden sm:flex"
					} sm:w-[65%] w-full h-full flex-col bg-slate-800 relative`}
			>
				{selectedChat ? (
					<MessageBox chatId={selectedChat._id} />
				) : (
					<ChatNotSelected />
				)}
			</div>
		</div>
	);
};

export default Home;

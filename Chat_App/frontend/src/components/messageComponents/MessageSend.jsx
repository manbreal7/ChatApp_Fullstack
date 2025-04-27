import React, { useEffect, useRef, useState } from "react";
import { FaFolderOpen, FaPaperPlane } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSendLoading, setTyping } from "../../redux/slices/conditionSlice";
import {
	addNewMessage,
	addNewMessageId,
} from "../../redux/slices/messageSlice";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

let lastTypingTime;

const MessageSend = ({ chatId }) => {
	const mediaFile = useRef();
	const [mediaBox, setMediaBox] = useState(false);
	const [mediaURL, setMediaURL] = useState("");
	const [newMessage, setMessage] = useState("");

	const dispatch = useDispatch();
	const isSendLoading = useSelector((store) => store?.condition?.isSendLoading);
	const isSocketConnected = useSelector((store) => store?.condition?.isSocketConnected);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const isTyping = useSelector((store) => store?.condition?.isTyping);

	useEffect(() => {
		socket.on("typing", () => dispatch(setTyping(true)));
		socket.on("stop typing", () => dispatch(setTyping(false)));

		return () => {
			socket.off("typing");
			socket.off("stop typing");
		};
	}, [dispatch]);

	const handleMediaBox = () => {
		const file = mediaFile.current?.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setMediaURL(url);
			setMediaBox(true);
		} else {
			setMediaBox(false);
		}
	};


	const clearMediaFile = () => {
		mediaFile.current.value = "";
		setMediaURL("");
		setMediaBox(false);
	};

	// const handleSendMessage = async () => {
	// 	if (!newMessage.trim() && !mediaURL) return;

	// 	const message = newMessage.trim();
	// 	setMessage("");
	// 	socket.emit("stop typing", selectedChat._id);
	// 	dispatch(setSendLoading(true));

	// 	let mediaBase64 = null;

	// 	if (mediaFile.current?.files?.[0]) {
	// 		const file = mediaFile.current.files[0];

	// 		// Convert file to base64
	// 		mediaBase64 = await new Promise((resolve, reject) => {
	// 			const reader = new FileReader();
	// 			reader.readAsDataURL(file);
	// 			reader.onload = () => resolve(reader.result);
	// 			reader.onerror = (error) => reject(error);
	// 		});
	// 	}
	// 	// console.log({ message, chatId, media: mediaBase64 })
	// 	try {
	// 		const token = localStorage.getItem("token");
	// 		const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message`, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 			body: JSON.stringify({ message, chatId, media: mediaBase64 }),
	// 		});

	// 		const json = await res.json();
	// 		if (json?.data) {
	// 			dispatch(addNewMessageId(json.data._id));
	// 			dispatch(addNewMessage(json.data));
	// 			socket.emit("new message", json.data);
	// 		} else {
	// 			throw new Error("Message creation failed");
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 		toast.error("Message sending failed.");
	// 	} finally {
	// 		dispatch(setSendLoading(false));
	// 		clearMediaFile(); // Reset media state
	// 	}
	// };

	const handleSendMessage = async () => {
		if (!newMessage.trim() && !mediaURL) return;

		const message = newMessage.trim();
		setMessage("");
		socket.emit("stop typing", selectedChat._id);
		dispatch(setSendLoading(true));

		let mediaBase64 = null;
		let toastId;

		try {
			if (mediaFile.current?.files?.[0]) {
				toastId = toast.loading("Uploading media...");
				const file = mediaFile.current.files[0];

				// Convert file to base64
				mediaBase64 = await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => resolve(reader.result);
					reader.onerror = (error) => reject(error);
				});
			}

			const token = localStorage.getItem("token");
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ message, chatId, media: mediaBase64 }),
			});

			const json = await res.json();
			if (json?.data) {
				dispatch(addNewMessageId(json.data._id));
				dispatch(addNewMessage(json.data));
				socket.emit("new message", json.data);
				if (toastId) toast.update(toastId, { render: "Media sent!", type: "success", isLoading: false, autoClose: 2000 });
			} else {
				throw new Error("Message creation failed");
			}
		} catch (err) {
			console.error(err);
			toast.error("Message sending failed.");
			if (toastId) toast.dismiss(toastId);
		} finally {
			dispatch(setSendLoading(false));
			clearMediaFile();
		}
	};


	const handleTyping = (e) => {
		const value = e.target.value;
		setMessage(value);

		if (!isSocketConnected) return;

		if (!isTyping) {
			socket.emit("typing", selectedChat._id);
		}

		lastTypingTime = new Date().getTime();
		const timerLength = 3000;

		setTimeout(() => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength) {
				socket.emit("stop typing", selectedChat._id);
			}
		}, timerLength);
	};

	return (
		<>
			{/* Media Preview */}
			{mediaBox && (
				<div className="absolute bottom-[8.5vh] left-3 w-64 h-44 bg-slate-900 border border-slate-600 rounded-lg shadow-md overflow-hidden z-20">
					<img
						src={mediaURL}
						alt="Preview"
						className="w-full h-full object-contain"
					/>
					<MdOutlineClose
						title="Remove Media"
						size={22}
						className="absolute top-2 right-2 bg-slate-800 p-1 text-white rounded-full cursor-pointer hover:bg-red-600 transition"
						onClick={clearMediaFile}
					/>
				</div>
			)}

			{/* Message Input */}
			<form
				className="w-full flex items-center gap-3 px-4 h-[10vh] bg-slate-800 border-t border-slate-700 text-white"
				onSubmit={(e) => e.preventDefault()}
			>
				{/* File Upload Icon */}
				<label htmlFor="media" className="cursor-pointer">
					<FaFolderOpen
						title="Attach Image"
						size={25}
						className="hover:text-green-400 transition"
					/>
				</label>
				<input
					ref={mediaFile}
					type="file"
					id="media"
					accept="image/png, image/jpeg, image/gif, image/jpg"
					className="hidden"
					onChange={handleMediaBox}
				/>

				{/* Text Input */}
				<input
					type="text"
					className="flex-1 p-2 bg-slate-700 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300"
					placeholder="Type your message..."
					value={newMessage}
					onChange={handleTyping}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSendMessage();
						}
					}}
				/>


				{/* Send Button or Loader */}
				{(newMessage.trim() || mediaURL) && !isSendLoading && (
					<button
						onClick={handleSendMessage}
						type="button"
						title="Send"
						className="p-2 text-white hover:text-green-400 transition"
					>
						<FaPaperPlane size={18} />
					</button>
				)}

				{isSendLoading && (
					<div className="p-2">
						<LuLoader size={18} className="animate-spin text-white" />
					</div>
				)}
			</form>
		</>
	);
};

export default MessageSend;

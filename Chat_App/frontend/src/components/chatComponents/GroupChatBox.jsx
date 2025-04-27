import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setGroupChatBox,
	setGroupChatId,
	setLoading,
} from "../../redux/slices/conditionSlice";
import { MdOutlineClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import ChatShimmer from "../loading/ChatShimmer";
import { handleScrollEnd } from "../../utils/handleScrollTop";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const GroupChatBox = () => {
	const groupUser = useRef(null);
	const dispatch = useDispatch();

	const isChatLoading = useSelector((state) => state?.condition?.isChatLoading);
	const authUserId = useSelector((state) => state?.auth?._id);

	const [isGroupName, setGroupName] = useState("");
	const [users, setUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isGroupUsers, setGroupUsers] = useState([]);

	useEffect(() => {
		const getAllUsers = () => {
			dispatch(setChatLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					setUsers(json.data || []);
					setSelectedUsers(json.data || []);
					dispatch(setChatLoading(false));
				})
				.catch((err) => {
					console.error(err);
					dispatch(setChatLoading(false));
				});
		};
		getAllUsers();
	}, []);

	useEffect(() => {
		setSelectedUsers(
			users.filter((user) =>
				[user.firstName, user.lastName, user.email].some((field) =>
					field.toLowerCase().includes(inputUserName?.toLowerCase())
				)
			)
		);
	}, [inputUserName]);

	useEffect(() => {
		handleScrollEnd(groupUser.current);
	}, [isGroupUsers]);

	const addGroupUser = (user) => {
		const exists = isGroupUsers.find((u) => u?._id === user?._id);
		if (!exists) {
			setGroupUsers([...isGroupUsers, user]);
		} else {
			toast.warn(`"${user?.firstName}" already added`);
		}
	};

	const handleRemoveGroupUser = (userId) => {
		setGroupUsers(isGroupUsers.filter((user) => user._id !== userId));
	};

	const handleCreateGroupChat = async () => {
		if (isGroupUsers.length < 2) {
			toast.warn("Please select at least 2 users");
			return;
		}
		if (!isGroupName.trim()) {
			toast.warn("Please enter a group name");
			return;
		}

		dispatch(setGroupChatBox());
		dispatch(setLoading(true));

		const token = localStorage.getItem("token");

		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: isGroupName.trim(),
				users: isGroupUsers,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setGroupChatId(json?.data?._id));
				dispatch(setLoading(false));
				socket.emit("chat created", json?.data, authUserId);
				toast.success("Group chat created & selected");
			})
			.catch((err) => {
				console.error(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full fixed top-0 left-0 bg-black/70 z-50 px-4">
			<div className="bg-slate-800 border border-slate-400 rounded-lg w-full max-w-2xl p-5 relative">
				<h2 className="text-2xl text-white font-semibold underline underline-offset-8 text-center mb-4">
					Create a Group
				</h2>

				{/* Search Input */}
				<div className="flex items-center gap-2 mb-3">
					<input
						type="text"
						value={inputUserName}
						onChange={(e) => setInputUserName(e.target.value)}
						placeholder="Search users..."
						className="flex-grow px-3 py-2 border border-slate-600 rounded bg-transparent text-white outline-none"
					/>
					<FaSearch className="text-white" />
				</div>

				{/* Selected Users */}
				<div
					ref={groupUser}
					className="flex gap-2 overflow-x-auto py-2 scroll-style-x mb-4"
				>
					{isGroupUsers.map((user) => (
						<div
							key={user._id}
							className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-md border border-slate-500 text-white"
						>
							<span>{user.firstName}</span>
							<button
								onClick={() => handleRemoveGroupUser(user._id)}
								className="hover:bg-black/40 rounded-full p-1"
							>
								<MdOutlineClose size={16} />
							</button>
						</div>
					))}
				</div>

				{/* User List */}
				<div className="h-60 overflow-y-auto scroll-style mb-4">
					{isChatLoading ? (
						<ChatShimmer />
					) : selectedUsers.length === 0 ? (
						<p className="text-center text-white">No users found</p>
					) : (
						selectedUsers.map((user) => (
							<div
								key={user._id}
								className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded cursor-pointer"
								onClick={() => {
									addGroupUser(user);
									setInputUserName("");
								}}
							>
								<img
									src={user.image}
									alt="user"
									className="h-10 w-10 rounded-full object-cover"
								/>
								<div className="text-white">
									<p className="capitalize">{user.firstName} {user.lastName}</p>
									<p className="text-xs text-slate-300">{SimpleDateAndTime(user.createdAt)}</p>
								</div>
							</div>
						))
					)}
				</div>

				{/* Group Name & Create Button */}
				<div className="flex items-center gap-2 mt-4">
					<input
						type="text"
						placeholder="Group Name"
						onChange={(e) => setGroupName(e.target.value)}
						className="flex-grow px-3 py-2 border border-slate-600 rounded bg-transparent text-white outline-none"
					/>
					<button
						onClick={handleCreateGroupChat}
						className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black hover:text-white rounded-lg font-semibold"
					>
						Create
					</button>
				</div>

				{/* Close Button */}
				<button
					onClick={() => dispatch(setGroupChatBox())}
					className="absolute top-3 right-3 text-white hover:bg-black/40 rounded-full p-1"
					title="Close"
				>
					<MdOutlineClose size={22} />
				</button>
			</div>
		</div>
	);
};

export default GroupChatBox;

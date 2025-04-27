// import React, { useEffect, useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import {
// 	setChatLoading,
// 	setLoading,
// 	setUserSearchBox,
// } from "../../redux/slices/conditionSlice";
// import { toast } from "react-toastify";
// import ChatShimmer from "../loading/ChatShimmer";
// import { addSelectedChat } from "../../redux/slices/myChatSlice";
// import { SimpleDateAndTime } from "../../utils/formateDateTime";
// import socket from "../../socket/socket";

// const UserSearch = () => {
// 	const dispatch = useDispatch();
// 	const isChatLoading = useSelector(
// 		(store) => store?.condition?.isChatLoading
// 	);
// 	const [users, setUsers] = useState([]);
// 	const [selectedUsers, setSelectedUsers] = useState([]);
// 	const [inputUserName, setInputUserName] = useState("");
// 	const authUserId = useSelector((store) => store?.auth?._id);

// 	// All Users Api Call
// 	useEffect(() => {
// 		const getAllUsers = () => {
// 			dispatch(setChatLoading(true));
// 			const token = localStorage.getItem("token");
// 			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
// 				method: "GET",
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`,
// 				},
// 			})
// 				.then((res) => res.json())
// 				.then((json) => {
// 					setUsers(json.data || []);
// 					setSelectedUsers(json.data || []);
// 					dispatch(setChatLoading(false));
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					dispatch(setChatLoading(false));
// 				});
// 		};
// 		getAllUsers();
// 	}, []);

// 	useEffect(() => {
// 		setSelectedUsers(
// 			users.filter((user) => {
// 				return (
// 					user.firstName
// 						.toLowerCase()
// 						.includes(inputUserName?.toLowerCase()) ||
// 					user.lastName
// 						.toLowerCase()
// 						.includes(inputUserName?.toLowerCase()) ||
// 					user.email
// 						.toLowerCase()
// 						.includes(inputUserName?.toLowerCase())
// 				);
// 			})
// 		);
// 	}, [inputUserName]);
// 	const handleCreateChat = async (userId) => {
// 		dispatch(setLoading(true));
// 		const token = localStorage.getItem("token");
// 		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: `Bearer ${token}`,
// 			},
// 			body: JSON.stringify({
// 				userId: userId,
// 			}),
// 		})
// 			.then((res) => res.json())
// 			.then((json) => {
// 				dispatch(addSelectedChat(json?.data));
// 				dispatch(setLoading(false));
// 				socket.emit("chat created", json?.data, authUserId);
// 				toast.success("Created & Selected chat");
// 				dispatch(setUserSearchBox());
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 				toast.error(err.message);
// 				dispatch(setLoading(false));
// 			});
// 	};
// 	return (
// 		<>
// 			<div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center bg-slate-800 text-white border-slate-500 border-r">
// 				<h1 className="mr-2 whitespace-nowrap">New Chat</h1>
// 				<div className="w-2/3 flex flex-nowrap items-center gap-2">
// 					<input
// 						id="search"
// 						type="text"
// 						placeholder="Search Users..."
// 						className="w-full border border-slate-600 py-1 px-2 font-normal outline-none rounded-md cursor-pointer bg-transparent active:bg-black/20"
// 						onChange={(e) => setInputUserName(e.target?.value)}
// 					/>
// 					<label htmlFor="search" className="cursor-pointer">
// 						<FaSearch title="Search Users" />
// 					</label>
// 				</div>
// 			</div>
// 			<div className="flex flex-col w-full px-4 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[73vh]">
// 				{selectedUsers.length == 0 && isChatLoading ? (
// 					<ChatShimmer />
// 				) : (
// 					<>
// 						{selectedUsers?.length === 0 && (
// 							<div className="w-full h-full flex justify-center items-center text-white">
// 								<h1 className="text-base font-semibold">
// 									No users registered.
// 								</h1>
// 							</div>
// 						)}
// 						{selectedUsers?.map((user) => {
// 							return (
// 								<div
// 									key={user?._id}
// 									className="w-full h-16 border-slate-500 border rounded-lg flex justify-start items-center p-2 font-semibold gap-2 hover:bg-black/50 transition-all cursor-pointer text-white"
// 									onClick={() => handleCreateChat(user._id)}
// 								>
// 									<img
// 										className="h-12 min-w-12 rounded-full"
// 										src={user?.image}
// 										alt="img"
// 									/>
// 									<div className="w-full">
// 										<span className="line-clamp-1 capitalize">
// 											{user?.firstName} {user?.lastName}
// 										</span>
// 										<div>
// 											<span className="text-xs font-light">
// 												{SimpleDateAndTime(
// 													user?.createdAt
// 												)}
// 											</span>
// 										</div>
// 									</div>
// 								</div>
// 							);
// 						})}
// 					</>
// 				)}
// 			</div>
// 		</>
// 	);
// };

// export default UserSearch;

import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setLoading,
	setUserSearchBox,
} from "../../redux/slices/conditionSlice";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { toast } from "react-toastify";
import ChatShimmer from "../loading/ChatShimmer";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const UserSearch = () => {
	const dispatch = useDispatch();
	const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
	const authUserId = useSelector((store) => store?.auth?._id);

	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");

	// Fetch users on mount
	useEffect(() => {
		const fetchUsers = async () => {
			dispatch(setChatLoading(true));
			const token = localStorage.getItem("token");

			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				const json = await res.json();
				if (!json?.data) throw new Error("No users found.");
				setUsers(json.data);
				setFilteredUsers(json.data);
			} catch (error) {
				console.error(error);
				toast.error(error?.message || "Failed to fetch users.");
			} finally {
				dispatch(setChatLoading(false));
			}
		};

		fetchUsers();
	}, [dispatch]);

	// Debounced search
	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (!inputUserName.trim()) {
				setFilteredUsers(users);
			} else {
				const lower = inputUserName.toLowerCase();
				const filtered = users.filter(
					(user) =>
						user.firstName.toLowerCase().includes(lower) ||
						user.lastName.toLowerCase().includes(lower) ||
						user.email.toLowerCase().includes(lower)
				);
				setFilteredUsers(filtered);
			}
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [inputUserName, users]);

	const handleCreateChat = async (userId) => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ userId }),
			});
			const json = await res.json();

			if (!json?.data) throw new Error(json?.message || "Chat creation failed");

			dispatch(addSelectedChat(json.data));
			socket.emit("chat created", json.data, authUserId);
			toast.success("Chat created and selected");
			dispatch(setUserSearchBox());
		} catch (err) {
			console.error(err);
			toast.error(err?.message || "Something went wrong.");
		} finally {
			dispatch(setLoading(false));
		}
	};

	return (
		<div className="w-full h-full flex flex-col bg-slate-900 text-white rounded-md shadow-xl overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
				<h2 className="text-lg font-semibold">Start a New Chat</h2>
				<div className="relative w-2/3">
					<input
						type="text"
						aria-label="Search users"
						placeholder="Search by name or email..."
						className="w-full pl-10 pr-4 py-2 rounded-md bg-slate-700 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
						value={inputUserName}
						onChange={(e) => setInputUserName(e.target.value)}
					/>
					<div className="absolute left-3 top-2.5 text-gray-300">
						<FaSearch />
					</div>
				</div>
			</div>

			{/* User List */}
			<div className="flex-1 overflow-y-auto scroll-style p-4">
				{isChatLoading ? (
					<ChatShimmer />
				) : filteredUsers.length === 0 ? (
					<div className="flex justify-center items-center h-full text-gray-400 text-sm">
						No users found.
					</div>
				) : (
					filteredUsers.map((user) => (
						<div
							key={user?._id}
							onClick={() => handleCreateChat(user._id)}
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition cursor-pointer"
						>
							<img
								src={user?.image}
								alt="User Avatar"
								className="w-12 h-12 rounded-full object-cover border border-gray-600"
							/>
							<div className="flex flex-col">
								<span className="font-medium capitalize">
									{user?.firstName} {user?.lastName}
								</span>
								<span className="text-xs text-gray-400">
									Joined: {SimpleDateAndTime(user?.createdAt)}
								</span>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default UserSearch;

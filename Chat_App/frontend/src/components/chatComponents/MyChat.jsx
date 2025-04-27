// import React, { useEffect } from "react";
// import { FaPenAlt } from "react-icons/fa";
// import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     setChatLoading,
//     setGroupChatBox,
// } from "../../redux/slices/conditionSlice";
// import ChatShimmer from "../loading/ChatShimmer";
// import getChatName, { getChatImage } from "../../utils/getChatName";
// import { VscCheckAll } from "react-icons/vsc";
// import { SimpleDateAndTime, SimpleTime } from "../../utils/formateDateTime";

// const MyChat = () => {
//     const dispatch = useDispatch();
//     const myChat = useSelector((store) => store.myChat.chat);
//     const authUserId = useSelector((store) => store?.auth?._id);
//     const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
//     const isChatLoading = useSelector(
//         (store) => store?.condition?.isChatLoading
//     );
//     // Re render newmessage send and new group chat created
//     const newMessageId = useSelector((store) => store?.message?.newMessageId);
//     const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);
//     // All My Chat Api Call
//     useEffect(() => {
//         const getMyChat = () => {
//             dispatch(setChatLoading(true));
//             const token = localStorage.getItem("token");
//             fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//                 .then((res) => res.json())
//                 .then((json) => {
//                     dispatch(addMyChat(json?.data || []));
//                     dispatch(setChatLoading(false));
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                     dispatch(setChatLoading(false));
//                 });
//         };
//         getMyChat();
//     }, [newMessageId, isGroupChatId]);
//     return (
//         <>
//             <div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center bg-slate-800 text-white border-slate-500 border-r">
//                 <h1 className="mr-2 whitespace-nowrap">My Chat</h1>
//                 <div
//                     className="flex items-center gap-2 border border-slate-600 py-1 px-2 rounded-md cursor-pointer hover:bg-slate-600 active:bg-black/20"
//                     title="Create New Group"
//                     onClick={() => dispatch(setGroupChatBox())}
//                 >
//                     <h1 className="line-clamp-1 lin whitespace-nowrap w-full">
//                         New Group
//                     </h1>
//                     <FaPenAlt />
//                 </div>
//             </div>
//             <div className="flex flex-col w-full px-4 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[73vh]">
//                 {myChat.length == 0 && isChatLoading ? (
//                     <ChatShimmer />
//                 ) : (
//                     <>
//                         {myChat?.length === 0 && (
//                             <div className="w-full h-full flex justify-center items-center text-white">
//                                 <h1 className="text-base font-semibold">
//                                     Start a new conversation.
//                                 </h1>
//                             </div>
//                         )}
//                         {myChat?.map((chat) => {
//                             return (
//                                 <div
//                                     key={chat?._id}
//                                     className={`w-full h-16 border-slate-500 border rounded-lg flex justify-start items-center p-2 font-semibold gap-2 hover:bg-black/55 to-slate-800  via-slate-300  from-slate-800 transition-all cursor-pointer ${
//                                         selectedChat?._id == chat?._id
//                                             ? "bg-gradient-to-tr text-black"
//                                             : "text-white"
//                                     }`}
//                                     onClick={() => {
//                                         dispatch(addSelectedChat(chat));
//                                     }}
//                                 >
//                                     <img
//                                         className="h-12 min-w-12 rounded-full"
//                                         src={getChatImage(chat, authUserId)}
//                                         alt="img"
//                                     />
//                                     <div className="w-full">
//                                         <div className="flex justify-between items-center w-full">
//                                             <span className="line-clamp-1 capitalize">
//                                                 {getChatName(chat, authUserId)}
//                                             </span>
//                                             <span className="text-xs font-light ml-1">
//                                                 {chat?.latestMessage &&
//                                                     SimpleTime(
//                                                         chat?.latestMessage
//                                                             ?.createdAt
//                                                     )}
//                                             </span>
//                                         </div>
//                                         <span className="text-xs font-light line-clamp-1 ">
//                                             {chat?.latestMessage ? (
//                                                 <div className="flex items-end gap-1">
//                                                     <span>
//                                                         {chat?.latestMessage
//                                                             ?.sender?._id ===
//                                                             authUserId && (
//                                                             <VscCheckAll
//                                                                 color="white"
//                                                                 fontSize={14}
//                                                             />
//                                                         )}
//                                                     </span>
//                                                     <span className="line-clamp-1">
//                                                         {
//                                                             chat?.latestMessage
//                                                                 ?.message
//                                                         }
//                                                     </span>
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-xs font-light">
//                                                     {SimpleDateAndTime(
//                                                         chat?.createdAt
//                                                     )}
//                                                 </span>
//                                             )}
//                                         </span>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </>
//                 )}
//             </div>
//         </>
//     );
// };

// export default MyChat;


import React, { useEffect } from "react";
import { FaPenAlt } from "react-icons/fa";
import { VscCheckAll } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import {
    setChatLoading,
    setGroupChatBox,
} from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import {
    SimpleDateAndTime,
    SimpleTime,
} from "../../utils/formateDateTime";

const MyChat = () => {
    const dispatch = useDispatch();
    const myChat = useSelector((store) => store.myChat.chat);
    const authUserId = useSelector((store) => store?.auth?._id);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const isChatLoading = useSelector(
        (store) => store?.condition?.isChatLoading
    );
    const newMessageId = useSelector((store) => store?.message?.newMessageId);
    const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);

    useEffect(() => {
        const getMyChat = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addMyChat(json?.data || []));
                    dispatch(setChatLoading(false));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setChatLoading(false));
                });
        };
        getMyChat();
    }, [newMessageId, isGroupChatId]);

    return (
        <>
            {/* Header */}
            <div className="p-4 h-[7vh] flex justify-between items-center bg-[#1e293b]">
                <h1 className="text-white font-bold text-lg tracking-wide">
                    My Chats
                </h1>
                <div
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-white rounded-md hover:bg-slate-600 active:scale-95 transition-transform cursor-pointer"
                    title="Create New Group"
                    onClick={() => dispatch(setGroupChatBox())}
                >
                    <span className="text-sm font-medium">New Group</span>
                    <FaPenAlt size={14} />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex flex-col gap-2 p-2 overflow-y-auto scroll-style h-[77vh] bg-[#2b344a]">
                {myChat.length === 0 && isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {myChat?.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-slate-300 font-medium text-sm">
                                Start a new conversation.
                            </div>
                        ) : (
                            myChat.map((chat) => (
                                <div
                                    key={chat?._id}
                                    className={`flex gap-3 p-3 rounded-md transition-all duration-200 hover:bg-slate-700/50 cursor-pointer ${selectedChat?._id === chat?._id
                                        ? "bg-slate-300 text-slate-900"
                                        : "bg-slate-700 text-white"
                                        }`}
                                    onClick={() => dispatch(addSelectedChat(chat))}
                                >
                                    <img
                                        className="w-12 h-12 rounded-full object-cover"
                                        src={getChatImage(chat, authUserId)}
                                        alt="chat avatar"
                                    />
                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold capitalize truncate">
                                                {getChatName(chat, authUserId)}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-2">
                                                {chat?.latestMessage &&
                                                    SimpleTime(chat?.latestMessage?.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-black truncate">
                                            {chat?.latestMessage ? (
                                                <>
                                                    {chat?.latestMessage?.sender?._id ===
                                                        authUserId && (
                                                            <VscCheckAll
                                                                size={16}
                                                                className="text-green-400"
                                                            />
                                                        )}
                                                    <span className="truncate">
                                                        {chat?.latestMessage?.message}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-500">
                                                    {SimpleDateAndTime(chat?.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default MyChat;

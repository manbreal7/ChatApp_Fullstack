import React from "react";

const ChatNotSelected = () => {
	return (
		<div className="flex justify-center items-center h-[80vh] w-full text-white text-center px-4">
			<h1 className="text-xl md:text-2xl font-semibold italic text-slate-300">
				Select a chat to start messaging
			</h1>
		</div>
	);
};

export default ChatNotSelected;

import Chat from '../models/chat.js';
import Message from '../models/message.js';

export const postChat = async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		return res.status(400).json({ message: 'User ID not provided' });
	}

	const existingChat = await Chat.find({
		isGroupChat: false,
		users: { $all: [req.user._id, userId] },
	})
		.populate('users', '-password')
		.populate({
			path: 'latestMessage',
			populate: {
				path: 'sender',
				select: '-password',
			},
		});

	if (existingChat.length > 0) {
		return res.status(200).json({ data: existingChat[0] });
	}

	const newChat = await Chat.create({
		chatName: 'Messenger',
		isGroupChat: false,
		users: [req.user._id, userId],
	});

	const fullChat = await Chat.findById(newChat._id).populate('users', '-password');

	res.status(201).json({ data: fullChat });
};

export const getChat = async (req, res) => {
	const chats = await Chat.find({
		users: { $elemMatch: { $eq: req.user._id } },
	})
		.sort({ updatedAt: -1 })
		.populate('users', '-password')
		.populate({
			path: 'latestMessage',
			populate: {
				path: 'sender',
				select: '-password',
			},
		})
		.populate('groupAdmin', '-password');

	res.status(200).json({ data: chats });
};

export const createGroup = async (req, res) => {
	const { users, name } = req.body;

	if (!users || !name) {
		return res.status(400).json({ message: 'Users and group name required' });
	}

	if (users.length < 2) {
		return res.status(400).json({ message: 'Minimum 2 users required for group' });
	}

	users.push(req.user._id);

	const groupChat = await Chat.create({
		chatName: name,
		isGroupChat: true,
		users,
		groupAdmin: req.user._id,
	});

	const fullGroup = await Chat.findById(groupChat._id)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	res.status(201).json({ data: fullGroup });
};

export const deleteGroup = async (req, res) => {
	const { chatId } = req.params;

	await Message.deleteMany({ chat: chatId });
	await Chat.findByIdAndDelete(chatId);

	res.status(200).json({ message: 'Group deleted successfully' });
};

export const renameGroup = async (req, res) => {
	const { name, chatId } = req.body;

	if (!name || !chatId) {
		return res.status(400).json({ message: 'Name and chatId required' });
	}

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{ chatName: name },
		{ new: true }
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!updatedChat) {
		return res.status(404).json({ message: 'Chat not found' });
	}

	res.status(200).json({ data: updatedChat });
};

export const removeFromGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	if (!chatId || !userId) {
		return res.status(400).json({ message: 'chatId and userId required' });
	}

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{ $pull: { users: userId } },
		{ new: true }
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!updatedChat) {
		return res.status(404).json({ message: 'Chat not found' });
	}

	res.status(200).json({ data: updatedChat });
};

export const addToGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	if (!chatId || !userId) {
		return res.status(400).json({ message: 'chatId and userId required' });
	}

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{ $addToSet: { users: userId } },
		{ new: true }
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!updatedChat) {
		return res.status(404).json({ message: 'Chat not found' });
	}

	res.status(200).json({ data: updatedChat });
};

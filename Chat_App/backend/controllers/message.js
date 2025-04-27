import Chat from '../models/chat.js';
import Message from '../models/message.js';
import cloudinary from "../config/cloudinary.js";

export const sendMessage = async (req, res) => {
	try {
		const { message, chatId, media } = req.body;

		if (!message && !media) {
			return res.status(400).json({ message: "Message or media is required." });
		}

		if (!chatId) {
			return res.status(400).json({ message: "chatId is required." });
		}

		let mediaUrl = null;

		if (media) {
			try {
				const uploadResult = await cloudinary.uploader.upload(media, {
					folder: "chatApp/media",
				});
				mediaUrl = uploadResult.secure_url;
			} catch (uploadErr) {
				console.error("Cloudinary Upload Error:", uploadErr);
				return res.status(500).json({ message: "Media upload failed." });
			}
		}

		const newMessage = await Message.create({
			sender: req.user._id,
			message,
			chat: chatId,
			media: mediaUrl,
		});

		await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

		const fullMessage = await Message.findById(newMessage._id)
			.populate("sender", "-password")
			.populate({
				path: "chat",
				populate: {
					path: "users groupAdmin",
					select: "-password",
				},
			});

		res.status(201).json({ data: fullMessage });
	} catch (err) {
		console.error("Error sending message:", err);
		res.status(500).json({ message: "Something went wrong." });
	}
};

export const getMessages = async (req, res) => {
	const { chatId } = req.params;

	const messages = await Message.find({ chat: chatId })
		.populate('sender', '-password')
		.populate('chat');

	res.status(200).json({ data: messages });
};

export const clearMessages = async (req, res) => {
	const { chatId } = req.params;

	try {
		const messages = await Message.find({ chat: chatId });

		const deleteMediaPromises = messages
			.filter(msg => msg.media?.includes('res.cloudinary.com'))
			.map(msg => {
				const url = msg.media;
				const afterUpload = url.split('/upload/')[1]; 
				const publicId = afterUpload.substring(0, afterUpload.lastIndexOf('.')); 
				return cloudinary.uploader.destroy(publicId);
			});

		await Promise.all(deleteMediaPromises);
		await Message.deleteMany({ chat: chatId });
		res.status(200).json({ message: 'Chat and associated media deleted successfully.' });
	} catch (err) {
		console.error('Error while deleting chat:', err);
		res.status(500).json({ error: 'Failed to delete chat and media.' });
	}
};



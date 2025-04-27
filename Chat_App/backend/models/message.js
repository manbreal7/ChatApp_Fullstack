import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			default: null,
			trim: true,
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		media: { type: String, default: null },
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

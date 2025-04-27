import User from '../models/user.js';

export const getAuthUser = async (req, res) => {
	if (!req.user) {
		return res.status(404).json({ message: 'User Not Found' });
	}

	res.status(200).json({
		data: req.user,
	});
};

export const getAllUsers = async (req, res) => {
	const allUsers = await User.find({ _id: { $ne: req.user._id } })
		.select('-password')
		.sort({ _id: -1 });

	res.status(200).json({ data: allUsers });
};

import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwtProvider.js';


export const registerUser = async (req, res, next) => {
	let { firstName, lastName, email, password } = req.body;
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		return res.status(400).json({ message: `User Already Exists` });
	}
	password = bcrypt.hashSync(password, 8);
	const userData = new User({
		firstName,
		lastName,
		email,
		password,
	});
	const user = await userData.save();
	const jwt = generateToken(user._id);
	res.status(200).json({
		message: "Registration Successfully",
		token: jwt,
	});
};

export const loginUser = async (req, res) => {
	let { email, password } = req.body;
	let user = await User.findOne({ email: email });
	if (!user) {
		return res.status(404).json({ message: `User Not Found` });
	}
	const isPasswordValid = bcrypt.compareSync(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid Password" });
	}
	const jwt = generateToken(user._id);
	user.password = null;
	res.status(200).json({
		message: "Login Successfully",
		data: user,
		token: jwt,
	});
};


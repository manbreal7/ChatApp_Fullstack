import jwt from 'jsonwebtoken';

const JWT_SECRET = "ZemdqlcJqkK0WzNbnLcL8aGio9V83q250oBksqbNrOPXgI2urlnbkPHRQbPHxvTL";
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Generate JWT token for a user ID
export const generateToken = (userId) => {
	if (!userId) {
		throw new Error("generateToken: userId is required");
	}
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '48h' });
};

// Extract user ID from token
export const getUserIdFromToken = (token) => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded.userId;
	} catch (err) {
		console.error("JWT verification failed:", err.message);
		throw new Error("Invalid or expired token");
	}
};

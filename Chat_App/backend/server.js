import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import setupSocket from './socket.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
	origin: process.env.FRONTEND_URL || '*',
	methods: ['GET', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to Chat Application!',
		frontend_url: process.env.FRONTEND_URL,
	});
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// 404 handler
app.all('*', (req, res) => {
	res.status(404).json({ error: 'Invalid Route' });
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Server & Socket.IO
const server = http.createServer(app);
const io = new SocketServer(server, {
	pingTimeout: 60000,
	transports: ['websocket'],
	cors: corsOptions,
});

setupSocket(io);

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

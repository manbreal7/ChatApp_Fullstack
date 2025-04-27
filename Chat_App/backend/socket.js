export default function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('[+] Connected to socket.io:', socket.id);

        socket.on('setup', (userId) => {
            if (!socket.hasJoined) {
                socket.join(userId);
                socket.hasJoined = true;
                console.log(`[+] User joined personal room: ${userId}`);
                socket.emit('connected');
            }
        });

        socket.on('new message', (newMessage) => {
            const chat = newMessage?.chat;
            if (!chat?.users) return;

            chat.users.forEach((user) => {
                if (user._id === newMessage.sender._id) return;
                socket.in(user._id).emit('message received', newMessage);
            });
        });

        socket.on('join chat', (roomId) => {
            if (socket.currentRoom === roomId) return;

            if (socket.currentRoom) {
                socket.leave(socket.currentRoom);
                console.log(`[-] Left room: ${socket.currentRoom}`);
            }

            socket.join(roomId);
            socket.currentRoom = roomId;
            console.log(`[+] Joined room: ${roomId}`);
        });

        socket.on('typing', (roomId) => {
            socket.in(roomId).emit('typing');
        });

        socket.on('stop typing', (roomId) => {
            socket.in(roomId).emit('stop typing');
        });

        socket.on('clear chat', (chatId) => {
            socket.in(chatId).emit('clear chat', chatId);
        });

        socket.on('delete chat', (chat, authUserId) => {
            chat?.users?.forEach((user) => {
                if (user._id !== authUserId) {
                    socket.in(user._id).emit('delete chat', chat._id);
                }
            });
        });

        socket.on('chat created', (chat, authUserId) => {
            chat?.users?.forEach((user) => {
                if (user._id !== authUserId) {
                    socket.in(user._id).emit('chat created', chat);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`[-] Disconnected socket: ${socket.id}`);
        });
    });
}

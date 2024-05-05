const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*"
    }
});

// Store rooms
const rooms = {};

io.on('connection', (socket) => {
    socket.on('createRoom', (roomName, roomPassword) => {
        if (roomName === null) {
            socket.emit('error', { message: "Name field can't be empty." });
        } else {
            const roomId = (Date.now()).toString()
            rooms[roomId] = { id: roomId, ownerId: socket.id, name: roomName, password: roomPassword, users: [socket.id] };
            socket.join(roomId);
            socket.emit('roomCreated', rooms[roomId], socket.id);
        }
    });

    socket.on('joinRoom', (roomId, roomPassword) => {
        if (rooms[roomId] && (!rooms[roomId].password || rooms[roomId].password === roomPassword)) {
            socket.join(roomId);
            rooms[roomId].users.push(socket.id);
            socket.emit('roomJoined', rooms[roomId], socket.id);
            io.sockets.in(roomId).emit('updateRoom', rooms[roomId]);
        } else {
            socket.emit('error', { message: "Invalid room ID or password!" });
        }
    });

    socket.on('leaveRoom', (roomInfo) => {
        if (rooms[roomInfo.id].users.length !== 0)
            rooms[roomInfo.id].users.pop()

        if (rooms[roomInfo.id].users.length === 0)
            delete rooms[roomInfo.id]

        io.sockets.in(roomInfo.id).emit('updateRoom', rooms[roomInfo.id]);
        socket.join(-1);
        socket.emit('roomLeft');
    });

    socket.on('sendMessage', (roomInfo, message) => {
        io.sockets.in(roomInfo.id).emit('messageSent', socket.id, message);
    });

    socket.on('disconnect', () => {
        //console.log('User left.');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server works on port: ${PORT}`);
});

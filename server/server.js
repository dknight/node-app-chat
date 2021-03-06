const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage,
        generateLocationMessage} = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const APP_PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`, '#000'));
        }
    });

    socket.on('join', (params, cb) => {
        if (!isRealString(params.name)
            || !isRealString(params.room)
            || !isRealString(params.color)) {
            return cb('Name, room and color are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room, params.color);

        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app', '#000'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`, '#000'));
        
        cb();
    });

    socket.on('createMessage', (message, cb) => {
        const user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text, user.color));
        }
        cb();
    });

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room)
                .emit('newLocationMessage',
                generateLocationMessage(user.name, coords.lat, coords.lng));
        }

    });
});

server.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});
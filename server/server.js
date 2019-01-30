const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage,
        generateLocationMessage} = require('./utils/message');

const APP_PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        console.log('Client has been disconnected');
    });

    socket.emit('newMessage',
            generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage',
            generateMessage('Admin', 'New user is joined'))

    socket.on('createMessage', (message, cb) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.name, message.text));
        cb();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage',
            generateLocationMessage('Admin', coords.lat, coords.lng));
    });
});

server.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});
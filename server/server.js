const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Hello from admin',
        createdAt: Date.now()
    });
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user is joined',
        createdAt: Date.now()
    })

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: Date.now()
        });
        // socket.broadcast.emit('newMessage', {
        //     from: 'Dima',
        //     text: 'Hello again!',
        //     createdAt: 123432432
        // });
    });
});


server.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});
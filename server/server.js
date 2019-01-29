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
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('Client has been disconnected');
    });
    
});


server.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});
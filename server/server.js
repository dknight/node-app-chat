const path = require('path');
const express = require('express');

const APP_PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();

app.use(express.static(publicPath));


const server = app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
})
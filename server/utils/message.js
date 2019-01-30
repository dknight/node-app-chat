const moment = require('moment');

const generateMessage = (name ,text) => {
    return {
        name,
        text,
        createdAt: moment.valueOf()
    }
};

const generateLocationMessage = (name, lat, lng) => {
    return {
        name,
        url: `https://www.google.com/maps/@${lat},${lng},7z`,
        createdAt: moment.valueOf()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
};
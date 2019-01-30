const expect = require('expect');

const { generateMessage,
        generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const name = 'Dima';
        const text = 'Hello';
        const message = generateMessage(name, text);

        expect(message).toBeInstanceOf(Object);
        expect(typeof message.createdAt).toEqual('function');
        expect(message).toHaveProperty('name', name);
        expect(message).toHaveProperty('text', text);
        expect(message).toHaveProperty('createdAt');
    })
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const name = "boo";
        const lat = 1;
        const lng = 2;
        const loc = generateLocationMessage(name, lat, lng);
        expect(loc.url).toBe(`https://www.google.com/maps/@${lat},${lng},7z`);
        expect(typeof loc.createdAt).toBe('function');
        expect(loc).toHaveProperty('name', name);
    });
});
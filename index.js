const express = require('express');
const http = require('http');
const tmi = require('tmi.js');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

server.listen(3000);

const tmiClient = new tmi.Client({
    channels: ['aonoriaga'],
});

tmiClient.connect();

tmiClient.on('message', (_, tags, message) => {
    io.emit('newMessage', {
        message,
        tags
    });

    if(message.startsWith('!color')) {
        const [ , color ] = message.split(' ');

        io.emit('setColor', { color });
    }
});


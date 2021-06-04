const tmi = require('tmi.js');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

const { chatBubble } = require('./chatMessage');

const tmiClient = new tmi.Client({
    channels: ['aonoriaga'],
});

tmiClient.connect();

tmiClient.on('message', (channel, tags, message, self) => {
    console.log(channel, tags, message, self);
});


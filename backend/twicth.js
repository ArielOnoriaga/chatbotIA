const tmi = require('tmi.js');

const { Server } = require("socket.io");
let io;

const initSocketTwitch = (serve, ...channels) => {
  io = new Server(serve);

  const tmiClient = new tmi.Client({
    channels: channels,
  });

  tmiClient.connect();

  tmiClient.on('message', (_, tags, message) => {
    commandHandler(message, tags);

    io.emit('newMessage', {
        message,
        tags
    });
  });
};

const checkCommand = (command, message) => message.startsWith(`!${command}`);

const isColor = (message) => checkCommand('color', message);
const isMate = (message) => message.includes(`!mate`);

const commandHandler = (message, tags) => {
  if(isColor(message)) {
    const [ , color ] = message.split(' ');

    io.emit('setColor', { color });
  }

  isMate(message) && io.emit('drinkMate');
};


module.exports = { initSocketTwitch }

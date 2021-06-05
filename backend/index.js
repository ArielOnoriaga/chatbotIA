const express = require('express');
const http = require('http');
const path = require('path');
const { initSocketTwitch } = require('./twicth');

const app = express();
const server = http.createServer(app);

const rootDir = path.resolve(__dirname, '../');

app.get('/', (_req, res) => {
  res.sendFile(rootDir + '/index.html');
});

const staticFiles = express.static(path.join(rootDir, '/public'));
app.use(staticFiles);

server.listen(3000);

initSocketTwitch(server, 'aonoriaga');

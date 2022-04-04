const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// import express from 'express'
// const app = express();

// import  http from 'http'
// const server = http.createServer(app);

// import {Server} from 'socket.io'
// const io = new Server(server);

app.use("/", express.static(__dirname + "/"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/ball', (req, res) => {
  res.sendFile(__dirname + '/Combined5.html');
});

app.get('/basketball', (req, res) => {
  res.sendFile(__dirname + '/Court.html');
});

io.on('connection', (socket) => {
  //console.log('a user connected')
  socket.on('propChanges', (msg) => {
    //console.log(msg);
    io.emit('propChanges', JSON.stringify(msg));
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// import express from './node_modules/express/lib/express.js'
// const app = express();

// const server = http.createServer(app);

// import {Server} from './node_modules/socket.io/dist/index.d.ts'
// const io = new Server(server);

// io.on('connection', (socket) => {
//     console.log('a user connected')
//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//     });
// });

var socket = io();

// form.addEventListener('submit', function (e) {
//     e.preventDefault();
//     if (input.value) {
//         console.log('Logging value ' + input.value);
//         socket.emit('chat message', input.value);
//         input.value = '';
//     }
// });

// socket.on('chat message', function (msg) {
//     var item = document.createElement('li');
//     item.textContent = msg;
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
// });



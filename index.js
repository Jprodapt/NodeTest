const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const url = require('url');

const NodeCache = require('node-cache')
const courtCache = new NodeCache();


const { v4: uuidv4 } = require('uuid');

app.use("/", express.static(__dirname + "/"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/ball', (req, res) => {
  res.sendFile(__dirname + '/Combined5.html');
});

app.get('/basketball', (req, res) => {
  var url_parts = url.parse(req.url, true);
  var id = url_parts.query;
  console.log("uui from the client "+id['id']);
  if(!id['id']){
    var uuid = uuidv4();
    console.log(uuid);
    res.cookie('uuidCookie', uuid);
    var courtAttributes = courtCache.get(uuid);
    res.cookie('courtCacheCookie', courtAttributes);
  }else{
    res.cookie('uuidCookie', id['id']);
    var courtAttributes = courtCache.get(id['id']);
    res.cookie('courtCacheCookie', courtAttributes);
  }
  res.sendFile(__dirname + '/Court.html');
  broadcastSocketIo(uuid);
});

app.get('/drag', (req, res) => {
  res.sendFile(__dirname + '/DragFile.html');
});

// View engine setup
app.set('view engine', 'ejs');
 
// Without middleware
app.get('/user', function(req, res){
 
    // Rendering home.ejs page
    res.render('home', { name: 'Tobi' });
})

app.get('/basketball1', (req, res) => {
  res.sendFile(__dirname + '/CourtMobile.html');
});

app.get('/carousel', (req, res) => {
  res.sendFile(__dirname + '/carouselBootstrap.html');
});

app.get('/hello', (req, res) => {
  res.send('<h1>Hello world</h1>');
});


io.on('connection', (socket) => {
  //console.log('a user connected')
  socket.on('propChanges', (msg) => {
    //console.log(msg);
    io.emit('propChanges', JSON.stringify(msg));
  });
});

function broadcastSocketIo (uuid){
  console.log('a user connected broadcastSocketIo called ')
  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on(uuid, (msg) => {
      //console.log(msg);
      //courtCache.set(uuid,msg);
      //console.log("court cache updated to  :: "+courtCache.get(uuid));
      io.emit(uuid, msg);
    });
    // socket.on(uuid+"chat", (msg) => {
    //   console.log('chat message '+msg);
    //   //courtCache.set(uuid,msg);
    //   //console.log("court cache updated to  :: "+courtCache.get(uuid));
    //   io.emit(uuid+"chat", msg);
    // });
  });
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});

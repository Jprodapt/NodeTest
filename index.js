const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const url = require('url');

const NodeCache = require('node-cache')
const courtCache = new NodeCache();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
  console.log("uui from the client " + id['id']);
  if (!id['id']) {
    var uuid = uuidv4();
    console.log(uuid);
    res.cookie('uuidCookie', uuid);
    var courtAttributes = courtCache.get(uuid);
    res.cookie('courtCacheCookie', courtAttributes);
  } else {
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

app.get('/threeLine', (req, res) => {
  res.sendFile(__dirname + '/ThreeLine.html');
});

app.get('/controls', (req, res) => {
  res.sendFile(__dirname + '/Controls.html');
});

app.get('/controls1', (req, res) => {
  res.sendFile(__dirname + '/Controls1.html');
});

app.get('/basketball1', (req, res) => {
  res.sendFile(__dirname + '/CourtMobile.html');
});

app.get('/carousel', (req, res) => {
  res.sendFile(__dirname + '/carouselBootstrap.html');
});

app.get('/hello', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.post('/api/sendEmail', (req, res) => {
  console.log("inside  send email " + req.body.emailId);
  console.log("inside  send email " + req.body.url);
  var mailOptions = {
    from: 'basketballbuild@donotreplyatt.com',
    to:  req.body.emailId,
    subject: 'Sending Email using Node.js',
    text: 'Here is the URL to join your dream court '+req.body.url
  };
  sendEmail(mailOptions);
  res.sendStatus(200);
});


io.on('connection', (socket) => {
  //console.log('a user connected')
  socket.on('propChanges', (msg) => {
    //console.log(msg);
    io.emit('propChanges', JSON.stringify(msg));
  });
});

function broadcastSocketIo(uuid) {
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

server.listen(3001, () => {
  console.log('listening on *:3001');
});


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'basketballbuild@gmail.com',
    pass: '!Prodapt1'
  }
});

var mailOptions = {
  from: 'basketballbuild@donotreplyatt.com',
  to: 'jaisimha.seelam@prodapt.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};
function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

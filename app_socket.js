const express = require('express');
const app = express();
const port = 8000; // port number

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('socket');
});

// io.on(): 서버에서의 소켓 연결 (셋팅)
// socket.emit(): 보낼 때
// socket.on(): 받을 때
io.on('connection', function (socket) {
  // socket이 연결되면 클라이언트가 이 내부 작업을 함
  console.log('Socket connected');

  socket.on('sendMsg', (msg) => {
    // io.emit('newMsg', `${socket.id}님: ${msg}`);
    io.emit('newMsg', { socketid: socket.id, message: msg });
  });

  socket.on('disconnect', () => {
    io.emit('notice', `${socket.id}님 나감`);
  });
});

http.listen(port, () => {
  console.log('8000!');
});

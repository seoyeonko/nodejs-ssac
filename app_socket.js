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

function getTime() {
  const now = new Date();
  let hour = now.getHours();
  let min = now.getMinutes();

  hour = hour >= 10 ? hour : '0' + hour;
  min = min >= 10 ? min : '0' + min;

  return `${hour}:${min}`;
}

// io.on(): 서버에서의 소켓 연결 (셋팅)
// socket.emit(): 보낼 때
// socket.on(): 받을 때
io.on('connection', function (socket) {
  // socket이 연결되면 클라이언트가 이 내부 작업을 함
  console.log('Socket connected');
  io.emit('noticeIn', { notice: `${socket.id}님이 입장했습니다.` });

  socket.emit('skcreated', { socketid: socket.id }); // client에게 보낼 socketid(보내는이의 아이디)

  socket.on('sendMsg', (msg) => {
    io.emit('newMsg', {
      socketid: msg['nickname'],
      message: msg['message'],
      now: getTime(),
    });
    socket.emit('myMsg', {
      message: msg['message'],
      now: getTime(),
    }); // msg
  });

  socket.on('disconnect', () => {
    io.emit('noticeOut', { notice: `${socket.id}님 퇴장했습니다.` });
  });
});

http.listen(port, () => {
  console.log('8000!');
});

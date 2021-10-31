const express = require('express');
const app = express();
const body = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 8000; // PORT number
let userNick;
let userList = []; // 배열 원소: { socketid, nickname }
// userList.length = 0; // 초기화

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(body.urlencoded({ extended: false }));
app.use(body.json());

app.get('/chat', (req, res) => {
  res.render('setNick');
});

app.post('/chat', (req, res) => {
  userNick = req.body.nickname.trim();
  res.render('socket', { userNick: userNick });
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
// io: socket.io
// socket: connection 성공시, 커넥션 정보
io.on('connection', function (socket) {
  // socket이 연결되면 클라이언트가 이 내부 작업을 함
  console.log('Socket connected');

  // userList
  userList.push({ socketid: socket.id, nickName: userNick });
  console.log(userNick + '님!!!! 입자아앙');
  console.log(userList);

  io.emit('noticeIn', {
    notice: `${userNick}(${socket.id.slice(0, 5)})님이 입장했습니다.`,
    userList: userList,
  });

  socket.emit('skcreated', { socketid: socket.id }); // client에게 보낼 socketid(보내는이의 아이디)

  socket.on('sendMsg', (msg) => {
    io.emit('newMsg', {
      socketid: socket.id, // 변경된 닉네임 -> 시리얼 넘버
      message: msg['message'],
      now: getTime(),
    });
    socket.emit('myMsg', {
      message: msg['message'],
      now: getTime(),
    }); // msg
  });

  socket.on('disconnect', () => {
    // userList 업데이트
    userList = userList.filter((element) => {
      // 배열 각 원소의 socketid !== 나가려는 브라우저의 socket.id; 배열에 남겨둠
      if (element.socketid !== socket.id) {
        return true;
      }
    });
    console.log(userNick + '님!!!! 퇴자아앙');
    console.log(userList);

    io.emit('noticeOut', {
      notice: `${userNick}(${socket.id.slice(0, 5)})님이 퇴장했습니다.`,
    });
  });
});

http.listen(PORT, () => {
  console.log('8000!');
});

const express = require('express');
const app = express();
const body = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const multer = require('multer');
const path = require('path');

const PORT = 8000; // PORT number

let userNick;
let filename;
let userList = {}; // 배열 원소: { socketid : {nickname, filename}, ... }
let upload_multer = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
      console.log(file); // 업로드 전 file 속성
      let ext = path.extname(file.originalname); // 확장자
      filename = path.basename(file.originalname, ext) + Date.now() + ext;
      callback(null, filename); // 파일명: 파일명+날짜+확장자
    },
  }),
  // limits: { filesize: 5 * 1024 * 1024 }, // 파일 사이즈 5MB 제한
});

app.use(body.urlencoded({ extended: false }));
app.use(body.json());
app.use('/img', express.static(__dirname + '/uploads'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/chat', (req, res) => {
  res.render('setNick');
});

app.post('/chat', upload_multer.single('profile'), (req, res) => {
  console.log(req.file); // 업로드 후 결과
  if (req.file === undefined) {
    filename = 'userDefault.png';
  }
  userNick = req.body.nickname.trim();
  res.render('chat', { userNick: userNick, filename: filename }); // socket
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
  let socketID = socket.id;

  // if (userList[socketID].nickname === undefined) {
  //   delete userList[socketID];
  // }
  // userList
  userList[socketID] = { nickname: userNick, filename: filename }; // 리스트에 추가
  console.log(userList[socketID].nickname + '님!!!! 입자아앙');
  console.log('** connection **');
  console.log(userList);
  console.log(userList[socketID].nickname);

  io.emit('noticeIn', {
    notice: `${userList[socketID].nickname}(${socketID.slice(
      0,
      5
    )})님이 입장했습니다.`,
    userList: userList,
  });

  socket.emit('skcreated', { socketid: socketID }); // client에게 보낼 socketid(보내는이의 아이디)

  socket.on('sendMsg', (msg) => {
    io.emit('newMsg', {
      socketid: socketID, // 변경된 닉네임 -> 시리얼 넘버
      userList: userList,
      message: msg['message'],
      now: getTime(),
    });
    socket.emit('myMsg', {
      message: msg['message'],
      now: getTime(),
    }); // msg
  });

  socket.on('disconnect', () => {
    // 퇴장 공지
    io.emit('noticeOut', {
      notice: `${userList[socketID].nickname}(${socketID.slice(
        0,
        5
      )})님이 퇴장했습니다.`,
    });

    // 리스트 업데이트
    console.log(userList[socketID].nickname + '님!!!! 퇴자아앙');
    delete userList[socketID]; // 리스트에서 삭제
    console.log('** updateList **');
    console.log(userList);

    io.emit('updateList', {
      userList: userList,
    });
  });
});

http.listen(PORT, () => {
  console.log('8000!');
});

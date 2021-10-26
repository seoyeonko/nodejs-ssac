const express = require('express');
const app = express();
const port = 8000; // port number

const http = require('http').Server(app);
const io = require("socket.io")(http);
// 소켓은 http 모듈에 연결
// express - http 연결
// http에서 socket 사용

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('socket');
});

// io.on(): 서버에서의 소켓 연결 (셋팅)
io.on("connection", function(socket) {
  // socket이 연결되면 클라이언트가 이 내부 작업을 함
  console.log("Socket connected")
  // socket과 관련한 통신 작업을 모두 처리

  // 보낼 때: socket.emit
  // 받을 때: socket.on

  socket.on("a", (data) => {
    console.log(data);
    // socket.emit("c");
    socket.emit("send", "hi");
  });
  
  socket.on("b", (data) => {
    console.log("bbb");
  });

  // 연결 끊기
  socket.on("disconnect", () => {
    console.log("disconnect");
  });

});

http.listen(port, () => {
  console.log('8000!');
});
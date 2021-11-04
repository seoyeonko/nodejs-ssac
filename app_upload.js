// multer 실습
const express = require('express');
const app = express();
const multer = require('multer'); // 모듈 설치 후 불러오기
const path = require('path'); // 내장 모듈
const PORT = 8000; // PORT number

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb: callback function
    cb(null, 'uploads/'); // 두번째 인자: 파일 업로드할 폴더명
  },
  filename: (req, file, cb) => {
    console.log(file); // 업로드 전 file이 가지는 속성 확인 가능 (ex. orininalname)
    // var newname = '1.png';
    // cb(null, file.originalname);

    // path 모듈을 사용해 파일 확장자 가져오기
    var extname = path.extname(file.originalname); // extname(): return .확장자
    cb(null, Date.now() + extname);
  },
});
var upload_multer = multer({ storage: storage });

// var upload = multer({
//   dest: 'uploads/', // 파일 업로드할 경로
// });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('upload');
});

// 단일 파일
app.post('/upload', upload_multer.single('userfile'), (req, res) => {
  // upload_multer.single : 단일 파일 처리
  // upload_multer.array : 여러 파일 처리
  // upload_multer.field : 여러 파일 처리 & input 태그나 폼 데이터의 키가 다른 경우

  console.log(req.file); // 업로드 후 파일 속성 확인 가능
  res.send('Success!');
});

// 다중 파일
app.post('/upload-multiple', upload_multer.array('userfile'), (req, res) => {
  console.log(req.files); // 업로드 후 파일 속성 확인 가능 (files: 다중 파일)
  res.send('Success!');
});

app.listen(PORT, () => {
  console.log('8000!');
});

// express 가져오기
const express = require('express');
const app = express();
const port = 8000; // port number

const session = require('express-session');
const cookie = require('cookie-parser');

// session 사용 옵션
app.use(
  session({
    secret: 'customer',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookie());

// ejs : Embaded JavaScript Templateing
// html 안에서 script 태그 없이 js 사용
// ejs 문법 사용 가능
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// static
app.use('/', express.static(__dirname + '/static'));

// form
const body = require('body-parser');
app.use(body.urlencoded({ extended: false }));
app.use(body.json());

app.get('/', (req, res) => {
  res.render('main.ejs');
});

// form
app.get('/form', (req, res) => {
  res.render('lecture/form');
});

app.post('/form', (req, res) => {
  console.log('post form 들어옴');
  console.log(req.body);
  console.log('여기는 쿠키다!' + req.headers.cookie);
  res.send('Complete form!');
  // res.render('form', {user: req.body})
});

// mysql 연결
const mysql = require('mysql');
var conn = mysql.createConnection({
  user: 'root',
  password: '1234',
  database: 'ssac',
});

// 회원가입
app.get('/signup', (req, res) => {
  res.render('member/signup', { title: 'Node를 배워보자!' });
});

app.post('/signup', (req, res) => {
  console.log('post signupResult 들어옴');
  console.log(req.body);
  // res.send('Complete formTest!');

  // DB
  var sql = `INSERT INTO users (usrid, pw, pw_check, name, email, gender) VALUES ('${req.body.usrid}', '${req.body.pw}', '${req.body.pw_check}', '${req.body.name}', '${req.body.email}', '${req.body.gender}');`;
  conn.query(sql, function (err) {
    if (err) {
      console.log('failed!! : ' + err);
    } else {
      console.log('data inserted!');
    }
  });

  res.render('member/signupResult', {
    id: req.body.usrid,
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
  });
});

// 로그인
app.get('/login', (req, res) => {
  res.render('member/login');
});

// 아이디 찾기
app.get('/findUsrid', (req, res) => {
  res.render('member/findUsrid');
});

app.post('/findUsrid', (req, res) => {
  var sql = `select * from users where email='${req.body.email}';`;
  conn.query(sql, function (err, results) {
    if (err) {
      console.log('failed!! : ' + err);
    } else {
      console.log('data selected!');
    }
    res.render('member/findUsrid2', { email: results[0]['usrid'] }); // email (unique key이므로 하나만 존재)
  });
});

// 비밀번호 변경(초기화)
app.get('/findUsrpw', (req, res) => {
  res.render('member/findUsrpw');
});

app.post('/findUsrpw', (req, res) => {
  var sql = `select * from users where usrid='${req.body.usrid}' and name='${req.body.name}' and email='${req.body.email}';`;
  conn.query(sql, (err, results) => {
    if (err) {
      console.log('failed!! : ' + err);
      // 아이디, 이름, 이메일 중 잘못 입력시 todo
    } else {
      console.log('data selected!');
      res.render('member/findUsrpw2', { usrid: results[0]['usrid'] });
    }
  });
});

app.post('/updateUsrpw', (req, res) => {
  var sql = `UPDATE users SET pw='${req.body.pw}', pw_check='${req.body.pw_check}' where usrid='${req.body.usrid}';`;
  conn.query(sql, (err, results) => {
    if (err) {
      console.log('failed!! : ' + err);
      // 아이디, 비번, 비번 재확인 중 잘못 입력시 todo
    } else {
      console.log('data selected!');
      console.log(req.body.pw);
      res.render('member/login');
    }
  });
});

// 마이페이지
app.get('/mypg', (req, res) => {
  res.render('member/mypage');
});

// 회원탈퇴
app.get('/leaveMem', (req, res) => {
  res.render('member/leaveMem');
});

app.post('/leaveMem', (req, res) => {
  // var sql1 = `SELECT * FROM users WHERE id='2'`;
  // var sql2 = `DELETE FROM users WHERE id='2'`; // 임의 삭제
  // conn.query(sql1, (err, results) => {
  //   // console.log(results)
  //   // console.log(results.length)
  //   if (results.length == 1) {
  //     conn.query(sql2, (err) => {
  //       console.log('data deleted!');
  //       res.render('main');
  //     });
  //   } else {
  //     console.log('failed!!!! : ' + err);
  //   }
  // });
});

// goodplaces
app.get('/goodplaces/placeList', (req, res) => {
  res.render('goodplaces/placeList');
});

app.get('/goodplaces/createPlace', (req, res) => {
  res.render('goodplaces/createPlace');
});

app.post('/goodplaces/createPlace', (req, res) => {
  var sql = `INSERT INTO places (name, review) VALUES ('${req.body.title}', '${req.body.review}');`;
  conn.query(sql, (err) => {
    if (err) {
      console.log('failed!! : ' + err);
    } else {
      console.log('data inserted!');
    }
  });
  res.render('goodplaces/placeList');
});

app.listen(port, () => {
  console.log('8000!');
});

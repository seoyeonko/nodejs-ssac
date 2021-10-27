'use strict';

const express = require('express');
const router = express.Router();

// mysql 연결
const mysql = require('mysql');
var conn = mysql.createConnection({
  user: 'root',
  password: '1234',
  database: 'ssac',
});

// 홈
router.get('/', (req, res) => {
  res.render('main.ejs');
});

// 회원가입
router.get('/signup', (req, res) => {
  res.render('member/signup', { title: 'Node를 배워보자!' });
});

router.post('/signup', (req, res) => {
  console.log('post signupResult 들어옴');
  console.log(req.body); // undefined... why..?
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
router.get('/login', (req, res) => {
  res.render('member/login');
});

// 아이디 찾기
router.get('/findUsrid', (req, res) => {
  res.render('member/findUsrid');
});

router.post('/findUsrid', (req, res) => {
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
router.get('/findUsrpw', (req, res) => {
  res.render('member/findUsrpw');
});

router.post('/findUsrpw', (req, res) => {
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

router.post('/updateUsrpw', (req, res) => {
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
router.get('/mypg', (req, res) => {
  res.render('member/mypage');
});

// 회원탈퇴
router.get('/leaveMem', (req, res) => {
  res.render('member/leaveMem');
});

router.post('/leaveMem', (req, res) => {
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

module.exports = router;

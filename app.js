// express 가져오기
const express = require('express');
const app = express();
const port = 8000; // port number*

// ejs : Embaded JavaScript Templateing
// html 안에서 script 태그 없이 js 사용
// ejs 문법 사용 가능
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// static 
app.use('/aaa', express.static(__dirname+ '/static'));

// form
const body = require('body-parser');
app.use(body.urlencoded({extended:false}));
app.use(body.json());

app.get('/', (req, res) => {
  res.render('main.ejs');
});

app.get('/test', (req, res) => {
	res.render('test', {parameter1: 5, parameter2: '코딩온'});
});

// form
app.get('/form', (req, res) => {
  res.render('form');
});

app.post('/form', (req, res) => {
  console.log('post form 들어옴');
  console.log(req.body);
  console.log('여기는 쿠키다!'+req.headers.cookie)
  res.send('Complete form!');
  // res.render('form', {user: req.body})
});

// mysql 연결 
const mysql = require('mysql');
var conn = mysql.createConnection({
	user: 'root',
	password: '1234',
	database: 'ssac'
});

// 회원가입 
app.get('/signup', (req, res) => {
  res.render('signup', {title: "Node를 배워보자!"});
});
  
app.post('/signup', (req, res) => {
  console.log('post signupResult 들어옴');
  console.log(req.body);
  // res.send('Complete formTest!');

  // DB
  var sql = `INSERT INTO users (usrid, pw, pw_check, name, email, gender) VALUES ('${req.body.usrid}', '${req.body.pw}', '${req.body.pw_check}', '${req.body.name}', '${req.body.email}', '${req.body.gender}');`
	conn.query(sql, function(err) {
    if (err) {
			console.log('failed!! : ' + err);
		}
		else {
			console.log("data inserted!");
		}
  });  

  res.render('signupResult', {id: req.body.usrid, name: req.body.name, email: req.body.email, gender: req.body.gender})
});

// 로그인
app.get('/login', (req, res) => {
  res.render('login')
});

// 아이디 찾기
app.get('/findUsrid', (req, res) => {
  res.render('findUsrid');
});

app.post('/findUsrid', (req, res) => {
  var sql = `select * from users where email='${req.body.email}';`;
  conn.query(sql, function(err, results) {
    if (err) {
      console.log('failed!! : ' + err);
    }
		else {
			console.log("data selected!");
		}
    res.render('findUsrid2', {email: results[0]['usrid']}); // email (unique key이므로 하나만 존재)
  });
});

// 비밀번호 변경(초기화)
app.get('/findUsrpw', (req, res) => {
  res.render('findUsrpw');
});

app.post('/findUsrpw', (req, res) => {
  var sql = `select * from users where usrid='${req.body.usrid}' and name='${req.body.name}' and email='${req.body.email}';`;
  conn.query(sql, (err, results) => {
    if (err) {
      console.log('failed!! : ' + err);
      // 아이디, 이름, 이메일 중 잘못 입력시 todo
    }
		else {
			console.log("data selected!");
      res.render('findUsrpw2', {usrid: results[0]['usrid']}); 
		}
  });
});

app.post('/updateUsrpw', (req, res) => {
  var sql = `UPDATE users SET pw='${req.body.pw}', pw_check='${req.body.pw_check}' where usrid='${req.body.usrid}';`;
  conn.query(sql, (err, results) => {
    if (err) {
      console.log('failed!! : ' + err);
      // 아이디, 비번, 비번 재확인 중 잘못 입력시 todo
    }
		else {
			console.log("data selected!");
			console.log(req.body.pw);
      res.render('login'); 
		}
  });
});


app.listen(port, () => {
  console.log('8000!');
});




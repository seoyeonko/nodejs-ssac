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
  res.send('안녕!!!')
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
  res.send('Complete form!');
});

app.listen(port, () => {
  console.log('8000!');
});
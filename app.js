'use strict';

// module
const express = require('express');
const app = express();
const body = require('body-parser');

// port number
const port = 8000;

// routing
const member = require('./routes/member');
const goodplaces = require('./routes/goodplaces');

// ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// static
app.use('/', express.static(__dirname + '/static'));

// body-parser
app.use(body.urlencoded({ extended: false }));
app.use(body.json());

// routing
app.use('/', member);
app.use('/goodplaces', goodplaces);

// 404 error
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log('8000!');
});

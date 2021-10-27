'use strict';

const express = require('express');
const router = express.Router();

// 맛집 목록
router.get('/placeList', (req, res) => {
  res.render('goodplaces/placeList');
});

// 맛집 등록
router.get('/createPlace', (req, res) => {
  res.render('goodplaces/createPlace');
});

router.post('/createPlace', (req, res) => {
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

module.exports = router;

var express = require('express');
var app = express();
var mysql = require( 'mysql' );

var conn = mysql.createConnection({
	user: 'root',
	password: '1234',
	database: 'ssac'
});


// app.listen( 8000, function () {
//   var sql = "INSERT INTO sql_practice VALUES ('k1234', 'aebek', '가나다', 'female', '1994-05-31');"
	
// 	conn.query(sql, function(err) {
//         if( err ){
// 			console.log( 'failed!! : ' + err );
// 		}
// 		else {
// 			console.log( "data inserted!" );
// 		}
//     });
// });

conn.connect( ( err ) => {
  if ( err ) console.log( err );
  else console.log( "DB connected successfully!" );
  });
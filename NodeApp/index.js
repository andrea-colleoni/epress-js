console.log('hello world');

var express = require('express');
var app = express();

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'test'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
});

app.get('/', function (req, res) {
    console.log(req.ip);
    res.send('Hello World!');
});

app.get('/posts', function(req, res) {
    var posts = [
        {
            id: 1,
            titolo: 'Atricolo di test',
            contenuto: 'Contenuto di test...'
        },{
            id: 2,
            titolo: 'Atricolo di test numero 2',
            contenuto: 'Contenuto di test numero 2...'
        }
    ];
    res.send(posts);
});

app.get('/persone', function(req, res) {
    connection.query('SELECT * from test', function (error, results, fields) {
        if (error) console.error(error);
        results.filter(function() {return true;});
        res.send(
            results.map(
                function (record) { return JSON.parse(JSON.stringify(record)); 
                })
            );
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
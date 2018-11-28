var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var md5 = require('md5');
const obj = JSON.parse(
  fs.readFileSync(__dirname + '/top_vietnamese_book_mappings_2.json', 'utf8'),
);
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'db',
});
connection.connect(err => {
  if (err) throw err;
  console.log('connected!');
});

var app = express();
app.use(express.static(__dirname + '/'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen('8081');
console.log('Magic happens on port 8081');

function imageUrlFromPath(path) {
  if (/product.*\.jpg$/.test(path))
    return `https://vcdn.tikicdn.com/cache/400x400/ts/${path}`;
  return `https://vcdn.tikicdn.com/cache/400x400/media/catalog/product/${path}`;
}
function convertImageUrl(img) {
  let imgName = md5(img);
  let pattern = /\.(.{3})$/g;
  let m = pattern.exec(img);
  return imgName + '.' + m[1];
}

app.post('/saved', function(req, res) {
  console.log(req.body);
  var productId = req.body.id;
  var link = req.body.link;
  var image = req.body.image;
  var data = {
    product_id: productId,
    link: link,
    image: image,
  };
  connection.query(
    'INSERT INTO tmp_mapping_tool SET ? ON DUPLICATE KEY UPDATE link = link',
    data,
    (err, res) => {
      if (err) throw err;
      console.log('last inserted id: ', res.insertId);
    },
  );
});

app.get('/', function(req, res) {
  let id = req.query.id || 0;
  let d = [];
  let data = [];
  let o = {};
  let thumbnail;
  if (obj[id] !== undefined) {
    let currentId;
    o = obj[id];
    thumbnail = imageUrlFromPath(o.thumbnail);
    if (o.data !== undefined && o.data !== null) {
      data = o.data;
      data.forEach(function(e) {
        d.push({
          title: e.Title,
          image: e.ImageName,
          link: e.Link,
          selected: false,
        });
      });
    }
  }
  res.render(__dirname + '/index.ejs', {
    obj: o,
    thumbnail: thumbnail,
    data: d,
    id: id,
  });
});

exports = module.exports = app;

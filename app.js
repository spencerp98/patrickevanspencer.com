const https = require('https');
const fs = require('fs');
var express = require("express");
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

var mysql = require('./dbcon.js');
app.set('mysql', mysql);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render('home');
});

app.get("/projects", function(req, res){
    res.render('projects');
});

app.use('/db-project', require('./db-project/db-project.js'));

app.get("/aboutme", function(req, res){
    res.render('aboutMe');
});

app.get("/resume", function(req, res){
    res.render('resume');
});

app.get("/contact", function(req, res){
    res.render('contact');
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Express started; press Ctrl-C to terminate.');
});
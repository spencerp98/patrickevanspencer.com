let port = process.env.PORT || 8000;
let hostname = process.env.IP;
if(port === 8000) {
    hostname = '127.0.0.1';
}

//set up express app
const express = require("express");
const app = express();

//set up modules
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set up template engine
const handlebars = require("express-handlebars").create({defaultLayout:"main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

// URLs

app.get("/", function(req, res){
    res.render('home');
});

app.get("/projects", function(req, res){
    res.render('projects');
});

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

app.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/ ; press Ctrl-C to terminate.`);
});
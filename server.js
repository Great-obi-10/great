if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config()
}




//IMPORT LIBRAIES THAT WE INSTALLED USING NPM
const express = require('express');
const bodyParser=require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const path = require('path');
const initializePassport = require('./passport-cofig');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

//passport

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)


app.use(bodyParser.json());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use (flash());
app.use(session({
    secret: 'process.env.SESSION_SECRET',
    resave : false ,// we wont resave d session variable if nothing changed
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());




//ROUTES
app.get('/',  (req, res) => {
    res.render("index.ejs") 
 })
 
 
 app.get('/login',  (req, res) => {
     res.render("login.ejs") 
  })
 
  
 app.get('/register',  (req, res) => {
     res.render("register.ejs") 
  })
  //END ROUTES
  

// configuring the login post functionality
app.post('/login', passport.authenticate ("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}) ) 

// mongo db connection
mongoose.connect('mongodb://localhost:27017/gfg');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

// inputing values to mongodb
app.post("/register",(req, res) => {
    var name = req.body.name;
    var name2 = req.body.name2;
    var email = req.body.email;
    var Password = req.body.Password; 

    var data = {
        "name": name,
        "name2": name2,
        "email": email,
        "password": Password

    }
    db.collection('details').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.redirect('/login');
})

app.get('/',function(req,res){
res.set({
	'Access-control-Allow-Origin': '*'
	});
return res.redirect('/login');
})








app.listen(3000);
console.log("listening on PORT 3000");
 

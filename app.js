require('dotenv').config() //put it on top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const encrypt = require('mongoose-encryption');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.listen(4000, function() {
  console.log("Server started on port 4000");
});
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/SecretsDB');
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//
const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:['password']});
//put it before model
const User = new mongoose.model("User", userSchema)

app.get("/", function(req,res){
  res.render("home")
});
app.get("/login", function(req,res){
  res.render("login")
});
app.get("/register", function(req,res){
  res.render("register")
});
app.get("/secrets", function(req,res){
  res.render("secrets")
});
app.get("/submit", function(req,res){
  res.render("submit")
});
//

app.post("/register", function(req,res){
  const newUser=new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets"); //we dont create get /secrets because its secrets
    }
  })
});

app.post("/login", function(req,res){
  const username = req.body.username
  const password = req.body.password
User.findOne({email:username}, function(err, foundUser){
  if(err){
    console.log(err);
  }else{
    if (foundUser){
      if(foundUser.password===password){
        res.render("secrets");
      }
    }
  }
})

})

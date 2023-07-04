require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});



const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login",function (req,res) {  
    res.render("login");
});

app.get('/register',function (req,res) {
    res.render("register");
});



app.post("/register",function(req,res){
    // passing the password to hash function for hashing
     bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
       const user = new User({
         email: req.body.username,
         password: hash,
       });
       user.save().then(function (userregistered) {
         if (userregistered) console.log("User registered successfully !");
         else console.log("user not registered");
         res.render("secrets");
       });
     });
});
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(function(foundUser){
            if(foundUser){
                // checking the password using bcrypt
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    }
                    else
                    {
                        res.render("login");
                    }
                });
            }
            else
                res.render("login");
    });
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});

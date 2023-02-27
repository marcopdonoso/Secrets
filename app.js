//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, doc) {
        if(err) {
            console.log(err);
        } else {
            if(doc) {
                if(doc.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});



app.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
});
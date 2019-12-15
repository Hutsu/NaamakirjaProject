// Connecting to Mongo as shown in demo

var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
const { sanitizeBody } = require("express-validator");

///////////////////////////////////////////////

var MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

///////////////////////////////////////////////

var url =
  "mongodb+srv://hutsu:Twopoints123@hutsundb-cezac.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("Connection Successful"))
  .catch(err => console.log(err));

mongoose.connection
  .once("open", function() {
    console.log("Connection Successful");
  })
  .on("error", function(error) {
    console.log("Connection Error", error);
  });

///////////////////////////////////////////////

//Creating schemas for DB

var postDB = new mongoose.Schema({
  postId: String,
  loggedIn: String,
  post: String,
  date: String
});

var userDB = new mongoose.Schema({
  username: String,
  password: String
});

///////////////////////////////////////////////

//Making schemas easier to access with variables

var post = mongoose.model("Post", postDB);
var user = mongoose.model("User", userDB);

///////////////////////////////////////////////

// Normal view on "posts"

router.get("/", function(req, res, next) {
  post.find({}, function(err, data) {
    if (err) throw err;

    res.render("posts", {
      title: userName,
      post_list: data
    });
  });
});

///////////////////////////////////////////////

// Creating new post in posts view

router.post(
  "/create",
  sanitizeBody("*")
    .trim()
    .escape(),

  // Getting content from input
  function(req, res, next) {
    var local_post = req.body.content;
    console.log("We got content: " + local_post);

    // Getting date information to show in post

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours() + 2;
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    var time =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    // Saving information of post in DB

    post({
      loggedIn: userName,
      post: local_post,
      date: time
    }).save(function(err) {
      if (err) throw err;
      console.log("post added!");
    });

    // Finding added post and other posts from DB

    post.find({}, function(err, data) {
      if (err) throw err;

      res.redirect("/posts");
    });
  }
);

///////////////////////////////////////////////

// Logging in and checking correct password

var userName = "";

router.post(
  "/login",
  sanitizeBody("*")
    .trim()
    .escape(),

  function(req, res, next) {
    var user_Name = req.body.user;
    var user_Password = req.body.userpassword;
    userName = user_Name;

    // Checking if there is the written username + passwrd combo in DB
    user.find({}, function(err, data) {
      if (err) throw err;
      var isUser = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].username === userName) {
          if (data[i].password === user_Password) {
            isUser++;
          }
        }
      }

      // If user doesn't exist

      if (isUser === 0) {
        res.render("index", {
          title: "Aleksin Naamakirja",
          message: "*You don't have user yet or username/password incorrect"
        });

        // If user is correct user gets to posts view
      } else {
        res.redirect("/posts");
      }
    });
  }
);

///////////////////////////////////////////////

// Log out (going back to index view)

router.post("/logout", function(req, res, next) {
  res.render("index", { title: "Aleksin Naamakirja" });
});
///////////////////////////////////////////////

//Creating new account to DB

router.post(
  "/signup",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    var local_user = req.body.user2;
    var local_password = req.body.userpassword2;
    var local_password2 = req.body.userpassword3;
    console.log("We got content: " + local_user);
    console.log("We got content: " + local_password);
    console.log("We got content: " + local_password2);

    //Checking if password is written similarly both times

    if (local_password === local_password2) {
      user({
        username: local_user,
        password: local_password
      }).save(function(err) {
        if (err) throw err;
        console.log("user added");
      });
      console.log("You may now log in");
      res.render("index", {
        title: "Aleksin Naamakirja",
        message2: "You may now log in"
      });
    } else {
      console.log("wrong password");
      res.render("index", {
        title: "Aleksin Naamakirja",
        message: "Please make sure that the passwords are similiar"
      });
    }
  }
);

///////////////////////////////////////////////

module.exports = router;

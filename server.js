"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");
const mongo = require("mongodb").MongoClient;

const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const routes = require("./routes.js");
const auth = require("./auth.js");

const app = express();

process.env.SESSION_SECRET = "random";
process.env.DATABASE =
  "mongodb+srv://dbMahmoud:asdf3456@cluster0-cifau.mongodb.net/test?retryWrites=true&w=majority";

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongo
  .connect(process.env.DATABASE)
  .then((client) => {
    var db = client.db("dbMahmoud");

    auth(app, db);
    routes(app, db);

    app.use((req, res, next) => {
      res.status(404).type("text").send("Not Found");
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  })
  .catch((err) => console.log(err));

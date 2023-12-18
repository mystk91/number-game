//Requests that change things about your profile, like name, profile pic, password, account deletion
//Also handles routing that occurs when user isn't logged in
function profileRequests(app) {
  const bcrypt = require("bcryptjs");
  const uniqid = require("uniqid");
  const crypto = require("crypto");
  const nodemailer = require("nodemailer");
  //Starting mongo
  const { MongoClient, Timestamp } = require("mongodb");
  let ObjectId = require("mongodb").ObjectId;
  const mongoClient = new MongoClient(process.env.mongoDB);

  //Profanity filter
  const {
    RegExpMatcher,
    TextCensor,
    englishDataset,
    englishRecommendedTransformers,
  } = require("obscenity");

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  /*
  //Redirects user to homepage if they are already logged in
  app.get("/login", async (req, res, next) => {
    try {
      if (req.user.session) {
        res.redirect("/");
      }
    } catch {
      next();
    }
  });
  */

  //Sets a new username for the user if its a valid username
  app.post("/api/new-username", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("Accounts");
    let errors = {
      username: "",
      password: "",
    };
    //Error Checking
    //Swear filter & character filter
    let usernameRegExp = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,16}$");
    if (
      matcher.hasMatch(req.body.newUsername) ||
      !usernameRegExp.test(req.body.newUsername)
    ) {
      errors.username = "Invalid username";
      res.send({ errors });
    } else {
      //Password error check
      try {
        let yourAccount = await accounts.findOne({
          session: req.body.user.session,
        });
        if (await bcrypt.compare(req.body.password, yourAccount.password)) {
          //Checks it name has been changed in past 30 days
          let today = new Date();
          if (
            today.getTime() - yourAccount.usernameDate.getTime() >=
            2592000000
          ) {
            await accounts.updateOne(
              { session: req.body.user.session },
              { $set: { username: req.body.newUsername, usernameDate: today } }
            );
            res.send({});
          } else {
            let numberOfDays = Math.floor(
              (today.getTime() - yourAccount.usernameDate.getTime()) / 86400000
            );
            numberOfDays = 30 - numberOfDays;
            let dayText = "day";
            if (numberOfDays != 1) {
              dayText += "s";
            }
            errors.username = `You can change your username in ${numberOfDays} ${dayText}`;
            res.send({ errors });
          }
        } else {
          errors.password = "Wrong password. Try again.";
          res.send({ errors });
        }
      } catch {
        errors.username = "Error! Name could not be updated.";
        res.send({ errors });
      }
    }
  });
}

module.exports = { profileRequests };

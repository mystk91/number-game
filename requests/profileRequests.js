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

  


}

module.exports = { profileRequests };

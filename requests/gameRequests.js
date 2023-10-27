//Requests related to maintaining game state
function gameRequests(app) {
  const bcrypt = require("bcryptjs");
  const uniqid = require("uniqid");
  const crypto = require("crypto");
  //Starting mongo
  const { MongoClient, Timestamp } = require("mongodb");
  let ObjectId = require("mongodb").ObjectId;
  const mongoClient = new MongoClient(process.env.mongoDB);
  async function connectMongo() {
    await mongoClient.connect();
  }
  connectMongo();

  //Used to redirect user to buy premium page if they haven't bought it
  async function redirectNonPremium(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = accounts.getOne({ session: req.user.session });
      if (account.premium == "true") {
        next();
      } else {
        res.redirect("/premium");
      }
    } catch {
      res.redirect("/premium");
    }
  }

  //Used to redirect user to buy premium page if they haven't bought it
  app.get("/2random", redirectNonPremium);
  app.get("/3random", redirectNonPremium);
  app.get("/4random", redirectNonPremium);
  app.get("/5random", redirectNonPremium);
  app.get("/6random", redirectNonPremium);
  app.get("/7random", redirectNonPremium);

  //Returns the random game the user has going if it exists, setting up the board
  app.get("/api/getCurrentGameRandom", async (req, res, next) => {

  });

  //Checks the users guess, updates the game on the database, returns graphics update
  app.post("/api/checkGuessRandom", async (req, res, next) => {

  });

  //Sets up or resets the random game, beginning a new game board if the game is completed
  app.post("/api/resetGameRandom", async (req, res, next) => {

  });

}

module.exports = { gameRequests };

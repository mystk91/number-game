const { error } = require("console");

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

  //Returns the gameboard saved to the user in the database
  async function getCurrentGameBoard(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = accounts.getOne({ session: req.user.session });
      let string = "/" + req.digits + "random";
      if (req.url == string) {
        if (!account[`${req.digits}random`]) {
          resetGameRandom(req, res, next);
        } else {
          res.send({
            board: account[`${req.digits}random`].board,
            currentRow: account[`${req.digits}random`].currentRow,
            hints: account[`${req.digits}random`].hints,
            status: account[`${req.digits}random`].status,
          });
        }
      } else {
        throw new Error();
      }
    } catch {
      res.redirect("/login");
    }
  }

  //Resets the gameboard and starts a new one save to the user in the database
  async function resetGameRandom(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = accounts.getOne({ session: req.user.session });
      let string = "/" + req.digits + "random";
      if (req.url == string) {
        if (account[`${req.digits}random`].status != "playing") {
          let targetNumber = Math.floor(
            Math.random() * Math.pow(10, req.digits)
          ).toString();
          while (targetNumber.length < req.digits) {
            targetNumber = "0" + targetNumber;
          }
          //Sets up the board
          let props = {
            attempts: 6,
          };
          let board = new Array(props.attempts);
          for (let i = 0; i < props.attempts; i++) {
            board[i] = "";
          }
          //Sets up the hints
          let hintsArr = new Array(props.attempts);
          for (let i = 0; i < props.attempts; i++) {
            hintsArr[i] = "";
          }

          let randomGameObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
            targetNumber: targetNumber,
          };

          let randomGameString = req.digits + "random";
          await accounts.updateOne({
            session: req.user.session,
            $set: {
              randomGameString: randomGameObj,
            },
          });

          let randomGameResObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
          };

          res.send(randomGameResObj);
        } else {
          getCurrentGameBoard(req, res, next);
        }
      } else {
        {
          throw new Error();
        }
      }
    } catch {
      res.redirect("/login");
    }
  }

  //Checks a guess for random vesion
  function checkGuessRandom() {}

  //Returns the random game the user has going if it exists, setting up the board
  app.put("/api/getCurrentGameRandom", async (req, res, next) => {
    getCurrentGameBoard(req, res, next);
  });

  //Checks the users guess, updates the game on the database, returns graphics update
  app.put("/api/checkGuessRandom", async (req, res, next) => {});

  //Sets up or resets the random game, beginning a new game board if the game is completed
  app.put("/api/resetGameRandom", async (req, res, next) => {
    resetGameRandom(req, res, next);
  });
}

module.exports = { gameRequests };

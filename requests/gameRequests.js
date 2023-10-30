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

  //Checks a guess for the random vesion of the game
  async function checkGuessRandom(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = accounts.getOne({ session: req.user.session });
      let validateNumber = false;
      if (isFinite(req.number) && req.number.length == req.digits) {
        validateNumber = true;
      }

      let string = "/" + req.digits + "random";
      if (req.url == string && validateNumber) {
        function checkNumber(number) {
          let result = "";
          //Compares the number with target number and applies wordle rules to it
          let target = account.targetNumber;
          let tempTarget = "";
          for (let i = 0; i < props.digits; i++) {
            if (number[i] === target[i]) {
              tempTarget += "G";
            } else {
              tempTarget += target[i];
            }
          }
          for (let i = 0; i < props.digits; i++) {
            if (tempTarget[i] === "G") {
              result += "G";
            } else if (tempTarget.includes(number[i])) {
              result += "Y";
            } else {
              result += "X";
            }
          }
          //Compares the number with target number numerically and creates a hint
          target = Number(target);
          number = Number(number);
          if (number > target) {
            result += "L";
          } else if (number < target) {
            result += "H";
          } else if (number === target) {
            result += "E";
          }
          console.log(result);
          return result;
        }

        let randomGameString = req.digits + "random";

        let boardCopy = [];
        Object.values(account[randomGameString].board).forEach((x) => {
          boardCopy.push(x);
        });
        boardCopy[account[randomGameString].currentRow] = req.number;

        let result = checkNumber(req.number);
        let hintsCopy = [];
        Object.values(account[randomGameString].hints).forEach((x) => {
          hintsCopy.push(x);
        });
        hintsCopy[account[randomGameString].currentRow] = result;

        let currentRow = account[randomGameString].currentRow + 1;

        let randomGameObj = {
          board: boardCopy,
          currentRow: currentRow,
          hints: hintsCopy,
          status: "playing",
          targetNumber: account[randomGameString].targetNumber,
        };

        //Adds a score to the users database entry. Keeps track past 30 scores and 1k scores
        //Returns an object containing the scores/averages that need to be updated in the DB
        function updateScores(score) {
          let scores30 = account[`scores30` + randomGameString];
          let currentDate = new Date();
          let scores30entry = {
            score: score,
            date: currentDate,
          };
          while (
            currentDate.getTime() - scores30[0].date.getTime() <
            2592000000
          ) {
            scores30.shift();
          }
          if (scores30.length >= 30) {
            scores30.shift();
          }
          scores30.push(scores30entry);

          let average30 =
            scores30.reduce((total, x) => {
              return total + x;
            }, 0) / scores30.length;

          let average30obj = {
            average: average30,
            length: scores30.length,
            date: scores30[0].date,
          };

          let scores1000 = account[`scores1000` + randomGameString];
          if (scores1000.length > 1000) {
            scores1000.shift();
          }
          scores1000.push(score);
          let average1000 =
            scores1000.reduce((total, x) => {
              return total + x;
            }, 0) / scores1000.length;

          let returnObj = {
            average30: average30obj,
            average1000: average1000,
            scores30: scores30,
            scores1000: scores1000,
          };

          return returnObj;
        }

        if (result == "GGGGE") {
          randomGameObj.status = "victory";
          let scoresObj = updateScores(account[randomGameString].currentRow);
          average30String = randomGameString + "average30";
          average1000String = randomGameString + "average1000";
          scores30String = randomGameString + "scores30";
          scores1000String = randomGameString + "scores1000";

          accounts.updateOne({
            session: req.session,
            $set: {
              randomGameString: randomGameObj,
              average30String: scoresObj.average30,
              average1000String: scoresObj.average1000,
              scores30String: scoresObj.scores30,
              scores1000String: scoresObj.scores1000,
            },
          });

          



        } else if (currentRow == 6) {
          randomGameObj.status = "defeat";
          let scoresObj = updateScores(7);
          average30String = randomGameString + "average30";
          average1000String = randomGameString + "average1000";
          scores30String = randomGameString + "scores30";
          scores1000String = randomGameString + "scores1000";

          accounts.updateOne({
            session: req.session,
            $set: {
              randomGameString: randomGameObj,
              average30String: scoresObj.average30,
              average1000String: scoresObj.average1000,
              scores30String: scoresObj.scores30,
              scores1000String: scoresObj.scores1000,
            },
          });
        } else {
          accounts.updateOne({
            session: req.session,
            $set: { randomGameString: randomGameObj },
          });
        }
      } else {
      }
    } catch {
      res.redirect("/login");
    }
  }

  //Returns the random game the user has going if it exists, setting up the board
  app.put("/api/getCurrentGameRandom", async (req, res, next) => {
    getCurrentGameBoard(req, res, next);
  });

  //Checks the users guess, updates the game on the database, returns graphics update
  app.put("/api/checkGuessRandom", async (req, res, next) => {
    checkRandomNumber(req, res, next);
  });

  //Sets up or resets the random game, beginning a new game board if the game is completed
  app.put("/api/resetGameRandom", async (req, res, next) => {
    resetGameRandom(req, res, next);
  });
}

module.exports = { gameRequests };

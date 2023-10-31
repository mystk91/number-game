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
      let account = await accounts.findOne({ session: req.user.session });
      if (account.premium == true) {
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
      let account = await accounts.findOne({ session: req.user.session });
      let randomGameString = req.body.digits + "random";
      if (req.body.url == "/" + randomGameString) {
        console.log("beginning process");
        if (!account[randomGameString]) {
          console.log("there is no game of the type already");
          resetGameRandom(req, res, next);
        } else {
          console.log("sending your game!");
          res.send({
            board: account[randomGameString].board,
            currentRow: account[randomGameString].currentRow,
            hints: account[randomGameString].hints,
            status: account[randomGameString].status,
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
      console.log("starting to reset your game");
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let randomGameString = req.body.digits + "random";
      console.log(req.body.url);
      if (req.body.url == "/" + randomGameString) {
        let condition = false;
        if (account[randomGameString]) {
          if (account[randomGameString].status != "playing") {
            condition = true;
          }
        } else {
          condition = true;
        }

        if (condition) {
          console.log("does it get here");
          let targetNumber = Math.floor(
            Math.random() * Math.pow(10, req.body.digits)
          ).toString();
          while (targetNumber.length < req.body.digits) {
            targetNumber = "0" + targetNumber;
          }
          //Sets up the board
          let props = {
            attempts: 6,
          };
          let board = new Array(6);
          for (let i = 0; i < 6; i++) {
            board[i] = "";
          }
          //Sets up the hints
          let hintsArr = new Array(6);
          for (let i = 0; i < 6; i++) {
            hintsArr[i] = "";
          }

          let randomGameObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
            targetNumber: targetNumber,
          };

          console.log(randomGameObj);

          let randomGameString = req.body.digits + "random";
          console.log(randomGameString);
          console.log(req.user.session);
          await accounts.updateOne(
            { session: req.user.session },
            {
              $set: {
                [randomGameString]: randomGameObj,
              },
            }
          );

          console.log("game updated");

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
      console.log(error);
      res.redirect("/login");
    }
  }

  //Checks a guess for the random vesion of the game
  async function checkGuessRandom(req, res, next) {
    try {
      console.log("it begins");
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      console.log("finds account");
      let validateNumber = false;
      if (
        isFinite(req.body.number) &&
        req.body.number.length == req.body.digits &&
        req.body.digits > 1
      ) {
        validateNumber = true;
      }
      let string = "/" + req.body.digits + "random";
      if (req.body.url == string && validateNumber) {
        let randomGameString = req.body.digits + "random";

        function checkNumber(number) {
          let result = "";
          //Compares the number with target number and applies wordle rules to it
          let target = account[randomGameString].targetNumber;
          console.log(target);
          let tempTarget = "";
          for (let i = 0; i < req.body.digits; i++) {
            if (number[i] === target[i]) {
              tempTarget += "G";
            } else {
              tempTarget += target[i];
            }
          }
          for (let i = 0; i < req.body.digits; i++) {
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

        let boardCopy = [];
        Object.values(account[randomGameString].board).forEach((x) => {
          boardCopy.push(x);
        });
        boardCopy[account[randomGameString].currentRow] = req.body.number;

        console.log("creates board");
        console.log(req.body.number);

        let result = checkNumber(req.body.number);
        console.log("the result is " + result);
        let hintsCopy = [];
        Object.values(account[randomGameString].hints).forEach((x) => {
          hintsCopy.push(x);
        });
        hintsCopy[account[randomGameString].currentRow] = result;

        console.log("creates hints");

        let currentRow = account[randomGameString].currentRow + 1;

        let randomGameObj = {
          board: boardCopy,
          currentRow: currentRow,
          hints: hintsCopy,
          status: "playing",
          targetNumber: account[randomGameString].targetNumber,
        };

        console.log(randomGameObj);

        //Adds a score to the users database entry. Keeps track past 30 scores and 1k scores
        //Returns an object containing the scores/averages that need to be updated in the DB
        // score - the score player recieved for that game
        // account - the users account that was retrieved from the DB
        function updateScores(score, account) {
          let scores30 = account[randomGameString + `-scores30`];

          if (scores30) {
            while (
              currentDate.getTime() - scores30[0].date.getTime() <
              2592000000
            ) {
              scores30.shift();
            }
            if (scores30.length >= 30) {
              scores30.shift();
            }
          } else {
            scores30 = [];
          }

          let currentDate = new Date();
          let scores30entry = {
            score: score,
            date: currentDate,
          };
          scores30.push(scores30entry);

          let average30 =
            scores30.reduce((total, x) => {
              return total + x.score;
            }, 0) / scores30.length;

          let average30obj = {
            average: average30,
            length: scores30.length,
            date: scores30[0].date,
          };

          let scores = account[randomGameString + `-scores`];
          if (!scores) {
            scores = [];
          }
          if (scores.length > 4096) {
            scores.shift();
          }
          scores.push(score);
          let average =
            scores.reduce((total, x) => {
              return total + x;
            }, 0) / scores.length;

          let returnObj = {
            average: average,
            average30: average30obj,
            scores: scores,
            scores30: scores30,
          };

          return returnObj;
        }

        let correctResult = "";
        for (let i = 0; i < req.body.digits; i++) {
          correctResult += "G";
        }
        correctResult += "E";

        console.log("the correct result is " + correctResult);
        console.log("and your result is " + result);

        if (result == correctResult) {
          randomGameObj.status = "victory";
          randomGameObj.targetNumber = account[randomGameString].targetNumber;
          let scoresObj = updateScores(
            account[randomGameString].currentRow + 1,
            account
          );
          console.log(scoresObj);
          let averageString = randomGameString + "-average";
          let average30String = randomGameString + "-average30";
          let scoresString = randomGameString + "-scores";
          let scores30String = randomGameString + "-scores30";

          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [randomGameString]: randomGameObj,
                [averageString]: scoresObj.average,
                [average30String]: scoresObj.average30,
                [scoresString]: scoresObj.scores,
                [scores30String]: scoresObj.scores30,
              },
            }
          );

          res.send({
            gameObj: randomGameObj,
            average: scoresObj.average,
            average30: scoresObj.average30,
            scores: scoresObj.scores,
            scores30: scoresObj.scores30,
          });
        } else if (currentRow == 6) {
          randomGameObj.status = "defeat";
          randomGameObj.targetNumber = account[randomGameString].targetNumber;
          let scoresObj = updateScores(7, account);
          console.log(scoresObj);
          let averageString = randomGameString + "-average";
          let average30String = randomGameString + "-average30";
          let scoresString = randomGameString + "-scores";
          let scores30String = randomGameString + "-scores30";

          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [randomGameString]: randomGameObj,
                [averageString]: scoresObj.average,
                [average30String]: scoresObj.average30,
                [scoresString]: scoresObj.scores,
                [scores30String]: scoresObj.scores30,
              },
            }
          );

          res.send({
            gameObj: randomGameObj,
            average30: scoresObj.average30,
            average: scoresObj.average,
            scores30: scoresObj.scores30,
            scores: scoresObj.scores,
          });
        } else {
          await accounts.updateOne(
            { session: req.body.session },
            { $set: { [randomGameString]: randomGameObj } }
          );

          res.send({
            gameObj: randomGameObj,
          });
        }
      } else {
        throw new Error();
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
    console.log("put");
    checkGuessRandom(req, res, next);
  });

  //Sets up or resets the random game, beginning a new game board if the game is completed
  app.put("/api/resetGameRandom", async (req, res, next) => {
    resetGameRandom(req, res, next);
  });
}

module.exports = { gameRequests };

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
      res.redirect("/login");
    }
  }

  //Used to redirect user to buy premium page if they haven't bought it
  app.get("/2random", redirectNonPremium);
  app.get("/3random", redirectNonPremium);
  app.get("/4random", redirectNonPremium);
  app.get("/5random", redirectNonPremium);
  app.get("/6random", redirectNonPremium);
  app.get("/7random", redirectNonPremium);

  //Returns the gameboard saved to the user in the database. RANDOM
  async function getCurrentGameRandom(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let randomGameString = req.body.digits + "random";
      if (req.body.url == "/" + randomGameString) {
        if (!account[randomGameString]) {
          resetGameRandom(req, res, next);
        } else {
          if (account[randomGameString].status == "playing") {
            res.send({
              gameObj: {
                board: account[randomGameString].board,
                currentRow: account[randomGameString].currentRow,
                hints: account[randomGameString].hints,
                status: account[randomGameString].status,
              },
            });
          } else {
            res.send({
              gameObj: {
                board: account[randomGameString].board,
                currentRow: account[randomGameString].currentRow,
                hints: account[randomGameString].hints,
                status: account[randomGameString].status,
                targetNumber: account[randomGameString].targetNumber,
              },
              scoresObj: {
                average: account[randomGameString + `-scores`].average,
                average30: account[randomGameString + `-scores`].average30,
                scores: account[randomGameString + `-scores`].scores,
                scores30: account[randomGameString + `-scores`].scores30,
              },
            });
          }
        }
      } else {
        throw new Error();
      }
    } catch {
      res.redirect("/login");
    }
  }

  //Resets the gameboard and starts a new one save to the user in the database. RANDOM
  async function resetGameRandom(req, res, next) {
    try {
      console.log("starting to reset your game");
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let randomGameString = req.body.digits + "random";
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
          await accounts.updateOne(
            { session: req.user.session },
            {
              $set: {
                [randomGameString]: randomGameObj,
              },
            }
          );

          let gameObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
          };
          let resObj = {
            gameObj: gameObj,
          };
          console.log("reseting the game");

          res.send(resObj);
        } else {
          getCurrentGameRandom(req, res, next);
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

  //Checks a guess for the random vesion of the game. RANDOM
  async function checkGuessRandom(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
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
          return result;
        }

        let boardCopy = [];
        Object.values(account[randomGameString].board).forEach((x) => {
          boardCopy.push(x);
        });
        boardCopy[account[randomGameString].currentRow] = req.body.number;

        let result = checkNumber(req.body.number);
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
        };

        let randomGameTargetObj = {
          board: boardCopy,
          currentRow: currentRow,
          hints: hintsCopy,
          status: "playing",
          targetNumber: account[randomGameString].targetNumber,
        };

        console.log(randomGameTargetObj);

        //Adds a score to the users database entry. Keeps track past 30 scores and 1k scores
        //Returns an object containing the scores/averages that need to be updated in the DB
        // score - the score player recieved for that game
        // account - the users account that was retrieved from the DB
        function updateScores(score, account) {
          let currentDate = new Date();

          let scoresObjDb = account[randomGameString + `-scores`];
          let scores30;
          if (scoresObjDb) {
            scores30 = scoresObjDb.scores30;
            while (
              currentDate.getTime() - scores30[0].date.getTime() >
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

          let scores;
          if (scoresObjDb) {
            scores = scoresObjDb.scores;
          }
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

          let scoresObj = {
            average: average,
            average30: average30obj,
            scores: scores,
            scores30: scores30,
          };

          return scoresObj;
        }

        let correctResult = "";
        for (let i = 0; i < req.body.digits; i++) {
          correctResult += "G";
        }
        correctResult += "E";

        if (result == correctResult) {
          randomGameTargetObj.status = "victory";
          let scoresObj = updateScores(
            account[randomGameString].currentRow + 1,
            account
          );
          console.log(scoresObj);

          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [randomGameString]: randomGameTargetObj,
                [randomGameString + `-scores`]: {
                  average: scoresObj.average,
                  average30: scoresObj.average30,
                  scores: scoresObj.scores,
                  scores30: scoresObj.scores30,
                },
              },
            }
          );

          res.send({
            gameObj: randomGameTargetObj,
            scoresObj: scoresObj,
          });
        } else if (currentRow == 6) {
          randomGameTargetObj.status = "defeat";
          let scoresObj = updateScores(7, account);
          console.log(scoresObj);
          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [randomGameString]: randomGameTargetObj,
                [randomGameString + `-scores`]: {
                  average: scoresObj.average,
                  average30: scoresObj.average30,
                  scores: scoresObj.scores,
                  scores30: scoresObj.scores30,
                },
              },
            }
          );

          res.send({
            gameObj: randomGameTargetObj,
            scoresObj: scoresObj,
          });
        } else {
          await accounts.updateOne(
            { session: req.body.session },
            { $set: { [randomGameString]: randomGameTargetObj } }
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

  //Returns the gameboard saved to the user in the database. REGULAR
  async function getCurrentGameRegular(req, res, next) {
    try {
      console.log("lets check out your game");
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let regularGameString = req.body.digits + "digits";
      //if (req.body.url == "/" + gameString) {
      if (req.body.url == "/regular") {
        if (!account[regularGameString]) {
          resetGameRegular(req, res, next);
        } else {
          if (account[regularGameString].status == "playing") {
            if (account[regularGameString].board[0] == "") {
              resetGameRegular(req, res, next);
            } else {
              res.send({
                gameObj: {
                  board: account[regularGameString].board,
                  currentRow: account[regularGameString].currentRow,
                  hints: account[regularGameString].hints,
                  status: account[regularGameString].status,
                },
              });
            }
          } else {
            const dbDailyGames = mongoClient.db("DailyGames");
            let todaysGame = await dbDailyGames
              .collection("DailyGames")
              .findOne({ digits: req.body.digits });
            let nextGameAvailable = false;
            console.log(todaysGame.gameId);
            console.log(account[regularGameString].gameId);
            if (todaysGame.gameId != account[regularGameString].gameId) {
              nextGameAvailable = true;
            }
            console.log(
              "it is " + nextGameAvailable + " that the next game is available"
            );
            if (req.body.firstCall && nextGameAvailable) {
              resetGameRegular(req, res, next);
            } else {
              console.log("success! sending!");
              console.log(account[regularGameString].board);
              res.send({
                gameObj: {
                  board: account[regularGameString].board,
                  currentRow: account[regularGameString].currentRow,
                  hints: account[regularGameString].hints,
                  status: account[regularGameString].status,
                  targetNumber: account[regularGameString].targetNumber,
                  //gameId: account[gameString].gameId,
                  nextGameAvailable:
                    account[regularGameString].nextGameAvailable,
                },
                scoresObj: {
                  average: account[regularGameString + `-scores`].average,
                  average30: account[regularGameString + `-scores`].average30,
                  scores: account[regularGameString + `-scores`].scores,
                  scores30: account[regularGameString + `-scores`].scores30,
                },
              });
            }
          }
        }
      } else {
        throw new Error();
      }
    } catch {
      res.redirect("/login");
    }
  }

  //Resets the gameboard and starts a new one save to the user in the database. REGULAR
  async function resetGameRegular(req, res, next) {
    try {
      console.log("starting to reset your game");
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let gameString = req.body.digits + "digits";
      //if (req.body.url == "/" + gameString) {
      if (req.body.url == "/regular") {
        let condition = false;
        if (account[gameString]) {
          if (
            account[gameString].status != "playing" ||
            account[gameString].board[0] == ""
          ) {
            condition = true;
          }
        } else {
          condition = true;
        }

        if (condition) {
          const dbDailyGames = mongoClient.db("DailyGames");
          let todaysGame = await dbDailyGames
            .collection("DailyGames")
            .findOne({ digits: req.body.digits });

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

          let regularGameObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
            targetNumber: todaysGame.targetNumber,
            gameId: todaysGame.gameId,
          };

          console.log(regularGameObj);

          let gameString = req.body.digits + "digits";
          await accounts.updateOne(
            { session: req.user.session },
            {
              $set: {
                [gameString]: regularGameObj,
              },
            }
          );

          let gameObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
          };
          let resObj = {
            gameObj: gameObj,
          };
          console.log("reseting the game");

          res.send(resObj);
        } else {
          getCurrentGameRegular(req, res, next);
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

  //Checks a guess for the random vesion of the game. REGULAR
  async function checkGuessRegular(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let validateNumber = false;
      if (
        isFinite(req.body.number) &&
        req.body.number.length == req.body.digits &&
        req.body.digits > 1
      ) {
        validateNumber = true;
      }
      let string = "/" + req.body.digits + "digits";
      //if (req.body.url == string && validateNumber) {
      if (req.body.url == "/regular" && validateNumber) {
        let regularGameString = req.body.digits + "digits";

        function checkNumber(number) {
          let result = "";
          //Compares the number with target number and applies wordle rules to it
          let target = account[regularGameString].targetNumber;
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
          return result;
        }

        let boardCopy = [];
        Object.values(account[regularGameString].board).forEach((x) => {
          boardCopy.push(x);
        });
        boardCopy[account[regularGameString].currentRow] = req.body.number;

        let result = checkNumber(req.body.number);
        let hintsCopy = [];
        Object.values(account[regularGameString].hints).forEach((x) => {
          hintsCopy.push(x);
        });
        hintsCopy[account[regularGameString].currentRow] = result;

        let currentRow = account[regularGameString].currentRow + 1;

        let regularGameObj = {
          board: boardCopy,
          currentRow: currentRow,
          hints: hintsCopy,
          status: "playing",
        };

        let regularGameTargetObj = {
          board: boardCopy,
          currentRow: currentRow,
          hints: hintsCopy,
          status: "playing",
          targetNumber: account[regularGameString].targetNumber,
          nextGameAvailable: false,
          gameId: account[regularGameString].gameId,
        };

        console.log(regularGameTargetObj);

        //Adds a score to the users database entry. Keeps track past 30 scores and 1k scores
        //Returns an object containing the scores/averages that need to be updated in the DB
        // score - the score player recieved for that game
        // account - the users account that was retrieved from the DB
        function updateScores(score, account) {
          let currentDate = new Date();

          let scoresObjDb = account[regularGameString + `-scores`];
          let scores30;
          if (scoresObjDb) {
            scores30 = scoresObjDb.scores30;
            if (scores30.length >= 30) {
              scores30.shift();
            }
          } else {
            scores30 = [];
          }

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
          };

          let scores;
          if (scoresObjDb) {
            scores = scoresObjDb.scores;
          }
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

          let scoresObj = {
            average: average,
            average30: average30obj,
            scores: scores,
            scores30: scores30,
          };

          return scoresObj;
        }

        let correctResult = "";
        for (let i = 0; i < req.body.digits; i++) {
          correctResult += "G";
        }
        correctResult += "E";

        if (result == correctResult) {
          regularGameTargetObj.status = "victory";
          let scoresObj = updateScores(
            account[regularGameString].currentRow + 1,
            account
          );
          //console.log(scoresObj);

          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [regularGameString]: regularGameTargetObj,
                [regularGameString + `-scores`]: {
                  average: scoresObj.average,
                  average30: scoresObj.average30,
                  scores: scoresObj.scores,
                  scores30: scoresObj.scores30,
                },
              },
            }
          );

          const dbDailyGames = mongoClient.db("DailyGames");
          let todaysGame = await dbDailyGames
            .collection("DailyGames")
            .findOne({ digits: req.body.digits });
          if (todaysGame.gameId != account[regularGameString].gameId) {
            regularGameTargetObj.nextGameAvailable = true;
          }

          console.log(
            "it is " +
              regularGameTargetObj.nextGameAvailable +
              " that the next game is available"
          );

          res.send({
            gameObj: regularGameTargetObj,
            scoresObj: scoresObj,
          });
        } else if (currentRow == 6) {
          regularGameTargetObj.status = "defeat";
          let scoresObj = updateScores(7, account);
          //console.log(scoresObj);
          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [regularGameString]: regularGameTargetObj,
                [regularGameString + `-scores`]: {
                  average: scoresObj.average,
                  average30: scoresObj.average30,
                  scores: scoresObj.scores,
                  scores30: scoresObj.scores30,
                },
              },
            }
          );

          const dbDailyGames = mongoClient.db("DailyGames");
          let todaysGame = await dbDailyGames
            .collection("DailyGames")
            .findOne({ digits: req.body.digits });
          if (todaysGame.gameId != account[regularGameString].gameId) {
            regularGameTargetObj.nextGameAvailable = true;
          }

          res.send({
            gameObj: regularGameTargetObj,
            scoresObj: scoresObj,
          });
        } else {
          await accounts.updateOne(
            { session: req.body.session },
            { $set: { [regularGameString]: regularGameTargetObj } }
          );

          res.send({
            gameObj: regularGameObj,
          });
        }
      } else {
        throw new Error();
      }
    } catch {
      res.redirect("/login");
    }
  }

  //Returns the gameboard saved to the user in the database. Local
  async function getCurrentGameLocal(req, res, next) {
    try {
      console.log("lets check out your game");
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let regularGameString = req.body.digits + "digits";
      //if (req.body.url == "/" + gameString) {
      if (req.body.url == "/local") {
        if (!account[regularGameString]) {
          resetGameRegular(req, res, next);
        } else {
          if (account[regularGameString].status == "playing") {
            if (account[regularGameString].board[0] == "") {
              resetGameRegular(req, res, next);
            } else {
              res.send({
                gameObj: {
                  board: account[regularGameString].board,
                  currentRow: account[regularGameString].currentRow,
                  hints: account[regularGameString].hints,
                  status: account[regularGameString].status,
                },
              });
            }
          } else {
            const dbDailyGames = mongoClient.db("DailyGames");
            let todaysGame = await dbDailyGames
              .collection("DailyGames")
              .findOne({ digits: req.body.digits });
            let nextGameAvailable = false;
            console.log(todaysGame.gameId);
            console.log(account[regularGameString].gameId);
            if (todaysGame.gameId != account[regularGameString].gameId) {
              nextGameAvailable = true;
            }
            console.log(
              "it is " + nextGameAvailable + " that the next game is available"
            );
            if (req.body.firstCall && nextGameAvailable) {
              resetGameRegular(req, res, next);
            } else {
              console.log("success! sending!");
              console.log(account[regularGameString].board);
              res.send({
                gameObj: {
                  board: account[regularGameString].board,
                  currentRow: account[regularGameString].currentRow,
                  hints: account[regularGameString].hints,
                  status: account[regularGameString].status,
                  targetNumber: account[regularGameString].targetNumber,
                  //gameId: account[gameString].gameId,
                  nextGameAvailable:
                    account[regularGameString].nextGameAvailable,
                },
                scoresObj: {
                  average: account[regularGameString + `-scores`].average,
                  average30: account[regularGameString + `-scores`].average30,
                  scores: account[regularGameString + `-scores`].scores,
                  scores30: account[regularGameString + `-scores`].scores30,
                },
              });
            }
          }
        }
      } else {
        throw new Error();
      }
    } catch {
      res.redirect("/login");
    }
  }

  //Resets the gameboard and starts a new one save to the user in the database. Local
  async function resetGameLocal(req, res, next) {
    try {
      console.log("starting to reset your game");
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let gameString = req.body.digits + "digits";
      //if (req.body.url == "/" + gameString) {
      if (req.body.url == "/local") {
        let condition = false;
        if (account[gameString]) {
          if (
            account[gameString].status != "playing" ||
            account[gameString].board[0] == ""
          ) {
            condition = true;
          }
        } else {
          condition = true;
        }

        if (condition) {
          const dbDailyGames = mongoClient.db("DailyGames");
          let todaysGame = await dbDailyGames
            .collection("DailyGames")
            .findOne({ digits: req.body.digits });

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

          let regularGameObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
            targetNumber: todaysGame.targetNumber,
            gameId: todaysGame.gameId,
          };

          console.log(regularGameObj);

          let gameString = req.body.digits + "digits";
          await accounts.updateOne(
            { session: req.user.session },
            {
              $set: {
                [gameString]: regularGameObj,
              },
            }
          );

          let gameObj = {
            board: board,
            currentRow: 0,
            hints: hintsArr,
            status: "playing",
          };
          let resObj = {
            gameObj: gameObj,
          };
          console.log("reseting the game");

          res.send(resObj);
        } else {
          getCurrentGameRegular(req, res, next);
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

  //Checks a guess for the random vesion of the game. Local
  async function checkGuessLocal(req, res, next) {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      let validateNumber = false;
      if (
        isFinite(req.body.number) &&
        req.body.number.length == req.body.digits &&
        req.body.digits > 1
      ) {
        validateNumber = true;
      }
      let string = "/" + req.body.digits + "digits";
      //if (req.body.url == string && validateNumber) {
      if (req.body.url == "/local" && validateNumber) {
        let regularGameString = req.body.digits + "digits";

        function checkNumber(number) {
          let result = "";
          //Compares the number with target number and applies wordle rules to it
          let target = account[regularGameString].targetNumber;
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
          return result;
        }

        let boardCopy = [];
        Object.values(account[regularGameString].board).forEach((x) => {
          boardCopy.push(x);
        });
        boardCopy[account[regularGameString].currentRow] = req.body.number;

        let result = checkNumber(req.body.number);
        let hintsCopy = [];
        Object.values(account[regularGameString].hints).forEach((x) => {
          hintsCopy.push(x);
        });
        hintsCopy[account[regularGameString].currentRow] = result;

        let currentRow = account[regularGameString].currentRow + 1;

        let regularGameObj = {
          board: boardCopy,
          currentRow: currentRow,
          hints: hintsCopy,
          status: "playing",
        };

        let regularGameTargetObj = {
          board: boardCopy,
          currentRow: currentRow,
          hints: hintsCopy,
          status: "playing",
          targetNumber: account[regularGameString].targetNumber,
          nextGameAvailable: false,
          gameId: account[regularGameString].gameId,
        };

        console.log(regularGameTargetObj);

        //Adds a score to the users database entry. Keeps track past 30 scores and 1k scores
        //Returns an object containing the scores/averages that need to be updated in the DB
        // score - the score player recieved for that game
        // account - the users account that was retrieved from the DB
        function updateScores(score, account) {
          let currentDate = new Date();

          let scoresObjDb = account[regularGameString + `-scores`];
          let scores30;
          if (scoresObjDb) {
            scores30 = scoresObjDb.scores30;
            if (scores30.length >= 30) {
              scores30.shift();
            }
          } else {
            scores30 = [];
          }

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
          };

          let scores;
          if (scoresObjDb) {
            scores = scoresObjDb.scores;
          }
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

          let scoresObj = {
            average: average,
            average30: average30obj,
            scores: scores,
            scores30: scores30,
          };

          return scoresObj;
        }

        let correctResult = "";
        for (let i = 0; i < req.body.digits; i++) {
          correctResult += "G";
        }
        correctResult += "E";

        if (result == correctResult) {
          regularGameTargetObj.status = "victory";
          let scoresObj = updateScores(
            account[regularGameString].currentRow + 1,
            account
          );
          //console.log(scoresObj);

          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [regularGameString]: regularGameTargetObj,
                [regularGameString + `-scores`]: {
                  average: scoresObj.average,
                  average30: scoresObj.average30,
                  scores: scoresObj.scores,
                  scores30: scoresObj.scores30,
                },
              },
            }
          );

          const dbDailyGames = mongoClient.db("DailyGames");
          let todaysGame = await dbDailyGames
            .collection("DailyGames")
            .findOne({ digits: req.body.digits });
          if (todaysGame.gameId != account[regularGameString].gameId) {
            regularGameTargetObj.nextGameAvailable = true;
          }

          console.log(
            "it is " +
              regularGameTargetObj.nextGameAvailable +
              " that the next game is available"
          );

          res.send({
            gameObj: regularGameTargetObj,
            scoresObj: scoresObj,
          });
        } else if (currentRow == 6) {
          regularGameTargetObj.status = "defeat";
          let scoresObj = updateScores(7, account);
          //console.log(scoresObj);
          await accounts.updateOne(
            { session: req.body.session },
            {
              $set: {
                [regularGameString]: regularGameTargetObj,
                [regularGameString + `-scores`]: {
                  average: scoresObj.average,
                  average30: scoresObj.average30,
                  scores: scoresObj.scores,
                  scores30: scoresObj.scores30,
                },
              },
            }
          );

          const dbDailyGames = mongoClient.db("DailyGames");
          let todaysGame = await dbDailyGames
            .collection("DailyGames")
            .findOne({ digits: req.body.digits });
          if (todaysGame.gameId != account[regularGameString].gameId) {
            regularGameTargetObj.nextGameAvailable = true;
          }

          res.send({
            gameObj: regularGameTargetObj,
            scoresObj: scoresObj,
          });
        } else {
          await accounts.updateOne(
            { session: req.body.session },
            { $set: { [regularGameString]: regularGameTargetObj } }
          );

          res.send({
            gameObj: regularGameObj,
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
    getCurrentGameRandom(req, res, next);
  });

  //Checks the users guess, updates the game on the database, returns graphics update
  app.put("/api/checkGuessRandom", async (req, res, next) => {
    checkGuessRandom(req, res, next);
  });

  //Sets up or resets the random game, beginning a new game board if the game is completed
  app.put("/api/resetGameRandom", async (req, res, next) => {
    resetGameRandom(req, res, next);
  });

  //Returns the random game the user has going if it exists, setting up the board
  app.put("/api/getCurrentGameRegular", async (req, res, next) => {
    getCurrentGameRegular(req, res, next);
  });

  //Checks the users guess, updates the game on the database, returns graphics update
  app.put("/api/checkGuessRegular", async (req, res, next) => {
    checkGuessRegular(req, res, next);
  });

  //Sets up or resets the random game, beginning a new game board if the game is completed
  app.put("/api/resetGameRegular", async (req, res, next) => {
    resetGameRegular(req, res, next);
  });

  //Returns the random game the user has going if it exists, setting up the board
  app.put("/api/getCurrentGameLocal", async (req, res, next) => {
    getCurrentGameLocal(req, res, next);
  });

  //Checks the users guess, updates the game on the database, returns graphics update
  app.put("/api/checkGuessLocal", async (req, res, next) => {
    checkGuessLocal(req, res, next);
  });

  //Sets up or resets the random game, beginning a new game board if the game is completed
  app.put("/api/resetGameLocal", async (req, res, next) => {
    resetGameLocal(req, res, next);
  });
}

module.exports = { gameRequests };

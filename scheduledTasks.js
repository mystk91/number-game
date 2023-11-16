//This will change the daily game to a new value every midnight EST
//Starting mongo
const { MongoClient, Timestamp } = require("mongodb");
let ObjectId = require("mongodb").ObjectId;
const mongoClient = new MongoClient(process.env.mongoDB);
const bcrypt = require("bcryptjs");
const uniqid = require("uniqid");
const crypto = require("crypto");

function scheduledTasks(app) {
  const nodeCron = require("node-cron");
  let createDailyGames = nodeCron.schedule(
    `*/2 * * * *`,
    async () => {
      console.log("A new started at " + new Date());
      const dbDailyGames = mongoClient.db("DailyGames");
      let dailyGames = dbDailyGames.collection(`DailyGames`);
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      function generateString(length) {
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(
              (characters.length * crypto.getRandomValues(new Uint32Array(1))) /
                Math.pow(2, 32)
            )
          );
        }
        return result;
      }
      let date = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      });
      for (let i = 2; i <= 7; i++) {
        let targetNumber = Math.floor(
          Math.random() * Math.pow(10, i)
        ).toString();
        while (targetNumber.length < i) {
          targetNumber = "0" + targetNumber;
        }

        let todaysGame = await dailyGames.findOne({ digits: i });
        let oldGames = dbDailyGames.collection(`OldGames-` + i);
        if (todaysGame) {
          await oldGames.insertOne({
            digits: todaysGame.digits,
            targetNumber: todaysGame.targetNumber,
            gameId: todaysGame.gameId,
            date: date,
          });

          let oldGameIdNumber = todaysGame.gameId.slice(
            todaysGame.gameId.length - 5,
            todaysGame.gameId.length
          );
          let newGameIdNumber = Number(oldGameIdNumber) + 1;
          while (newGameIdNumber.toString().length < 5) {
            newGameIdNumber = "0" + newGameIdNumber;
          }
          let newGameId = i + generateString(6) + newGameIdNumber;

          await dailyGames.updateOne(
            { digits: i },
            {
              $set: {
                digits: i,
                targetNumber: targetNumber,
                gameId: newGameId,
                date: date,
              },
            }
          );
        } else {
          await dailyGames.insertOne({
            digits: i,
            targetNumber: targetNumber,
            gameId: i + generateString(6) + `00001`,
          });
        }
      }
    },
    {
      scheduled: true,
      timezone: "America/New_York",
    }
  );
  createDailyGames.start();

  //Creating some test accounts and putting them on the leaderboard
  function createTestLeaderboard() {
    const accountsDb = mongoClient.db("Accounts");
    let accounts = dbDailyGames.collection(`TestAccounts`);
    let names = [
      "jaack",
      "ashhlee",
      "dolfin",
      "jauglar",
      "cheetlion",
      "maarz",
      "tara",
      "michealus",
      "loal",
      "oliv28",
      "uhhhm",
      "martin",
      "farren",
      "priscz",
      "freshman",
      "woha",
    ];

    for (let i = 0; i < names.length; i++) {
      let accountObj = {
        username: names[i],
        premium: true,
      };
      if (i > 14) {
        accountObj.premium = false;
      }

      for (let digits = 2; digits <= 7; digits++) {
        let average = Math.random() * 3 + 3 + 0.2 * digits;

        let numberOfGames = 30;
        if (i % 5 == 0) {
          numberOfGames = 15;
        }

        let currentDate = new Date();
        let oldDate = new Date("2020-10-10T08:58:15.643+00:00");
        let date = currentdate;
        if (i % 5 == 1) {
          date = oldDate;
        }

        if (i != digits) {
          accountObj[digits + "random-scores"] = {
            average: average,
            numberOfGames: numberOfGames,
            date: date,
          };
        }
      }
      accounts.insertOne(accountObj);
    }
  }

  createTestLeaderboard();

  //Updates the leaderboards for each random category on an hourly basis
  let updateLeaderboards = nodeCron.schedule(
    `*/2 * * * *`,
    async () => {
      //Does stuff to update leaderboards
      console.log("starting to update leaderboards");

      const accountsDb = mongoClient.db("Accounts");
      let accounts = dbDailyGames.collection(`TestAccounts`);
      let premiumAccounts = await accounts.find({ premium: true });
      const leaderboardsDb = mongoClient.db("Leaderboards");

      console.log("loaded dbs");

      let todaysDate = new Date();
      let todaysTime = todaysDate.getTime();

      for (let digits = 2; digits <= 7; digits++) {
        let eligibleAccounts = [];
        premiumAccounts.forEach((x) => {
          console.log("lets check if these values work");
          console.log(x[digits + `random-scores`]);
          console.log(x[digits + `random-scores`].average30);
          console.log(x[digits + `random-scores`].average30.numberOfGames);
          if (
            x[digits + `random-scores`].average30.numberOfGames == 30 &&
            todaysTime - x[digits + `random-scores`].average30.date.getTime() <=
              1000 * 60 * 60 * 24 * 30
          ) {
            eligibleAccounts.push(x);
            console.log("eligible, pushing");
          } else {
            console.log("not eligible");
          }
        });

        console.log("starting to sort");

        eligibleAccounts.sort(function (a, b) {
          return (
            b[digits + `random-scores`].average30.average -
            a[digits + `random-scores`].average30.average
          );
        });

        console.log("sorted");
        console.log(eligibleAccounts);

        let leaderboard = leaderboardsDb.collection("Leaderboard-" + digits);
        //not sure if this will work
        leaderboard.deleteMany({});

        console.log("clearing the database");

        let numberOfEntries = Math.max(50, eligibleAccounts.length);
        let currentAccount = eligibleAccounts[0];
        console.log("the first username is " + currentAccount.username);

        for (let i = 0; i < numberOfEntries; i++) {
          let currentAccount = eligibleAccounts[i];
          let leaderboardEntry = {
            rank: i + 1,
            username: currentAccount.username,
            average: currentAccount[digits + `random-scores`].average30.average,
          };
          leaderboard.insertOne(leaderboardEntry);
        }
      }
    },
    {
      scheduled: true,
      timezone: "America/New_York",
    }
  );

  //updateLeaderboards.start();
}

module.exports = { scheduledTasks };

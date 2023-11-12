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

  //Updates the leaderboards for each random category on an hourly basis
  let updateLeaderboards = nodeCron.schedule(
    `*/2 * * * *`,
    async () => {
      //Does stuff to update leaderboards
    },
    {
      scheduled: true,
      timezone: "America/New_York",
    }
  );
}

module.exports = { scheduledTasks };

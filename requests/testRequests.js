//Test requests and functions related to the database
function testRequests(app) {
  const bcrypt = require("bcryptjs");
  const uniqid = require("uniqid");
  const crypto = require("crypto");
  //Starting mongo
  const { MongoClient, Timestamp } = require("mongodb");
  let ObjectId = require("mongodb").ObjectId;
  const mongoClient = new MongoClient(process.env.mongoDB);

  //Fills an account I made with game scores to see how large it gets
  function testAccountSize() {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("Accounts");

    let gameTypes = ["digits", "random"];

    for (let i = 2; i <= 7; i++) {
      for (let j = 0; j <= 1; j++) {
        let scores = [];
        for (let n = 0; n < 9999; n++) {
          let randomNumber = Math.floor(6 * Math.random() + 1 + i * 0.2);
          if (randomNumber == 1) {
            if (n % 1000 != 0) {
              randomNumber++;
            }
          }
          if (randomNumber == 2) {
            if (n % 200 != 0) {
              randomNumber++;
            }
          }
          if (randomNumber == 3) {
            if (n % 3 != 0) {
              randomNumber++;
            }
          }
          if (randomNumber == 7) {
            if (n % 20 != 0) {
              randomNumber--;
            }
          }
          if (randomNumber == 6) {
            if (n % 3 != 0) {
              randomNumber--;
            }
          }
          scores.push(randomNumber);
        }

        let scores30 = [];
        for (let k = scores.length - 30; k < scores.length; k++) {
          scores30.push(scores[k]);
        }

        let average =
          scores.reduce((total, x) => {
            return total + x;
          }, 0) / scores.length;

        let average30 =
          scores30.reduce((total, x) => {
            return total + x;
          }, 0) / scores30.length;

        let scores30Objects = [];
        for (let n = 0; n < scores30.length; n++) {
          let obj = {
            score: scores30[n],
            date: new Date(),
          };
          scores30Objects.push(obj);
        }

        let scoresObj = {
          average: average,
          average30: {
            average: average30,
            numberOfGames: 30,
            date: new Date(),
          },
          scores: scores,
          scores30: scores30Objects,
          best30: { average: average30, date: new Date(), scores: scores30Objects },
        };

        accounts.updateOne(
          { email: "testAccount" },
          {
            $set: { [`${i}${gameTypes[j]}-scores`]: scoresObj },
          }
        );
      }
    }
  }

  //testAccountSize();





}

module.exports = { testRequests };

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

  //Adds the first games to the database if they don't exist, used when we have empty database entries
  async function addFirstGames() {
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
          /*
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
          */
        } else {
          await dailyGames.insertOne({
            digits: i,
            targetNumber: targetNumber,
            gameId: i + generateString(6) + `00001`,
          });
        }
      }

  }

  //addFirstGames();

  //Creating some test accounts and putting them on the leaderboard
  function createTestLeaderboard() {
    const accountsDb = mongoClient.db("Accounts");
    let accounts = accountsDb.collection(`TestAccounts`);
    let names = [
      "martiusAutumn",
      "Aprilwinters",
      "julietBarley",
      "AugustusSummers",
      "parsleyGoat",
      "JaneSaffron",
      "MartiusChestnut",
      "aprilCarrots",
      "MayParsley",
      "junePotato",
      "JulietSunflower",
      "augustusPeach",
      "OctaviusTurnip",
      "saffronOx",
      "Chestnutpepper",
      "tomatoCarrot",
      "Barleyparsnips",
      "potatoBarrel",
      "PumpkinApple",
      "sunflowerCelery",
      "Peachpear",
      "turnipPigeon",
      "OxFork",
      "pepperTruffle",
      "OliveTomato",
      "barleylettuce",
      "BarrelCauliflowr",
      "appleJuniper",
      "CeleryDeer",
      "pearMaple",
      "HorseCricket",
      "pineGoose",
      "PloughPeat",
      "TurnipTurkey",
      "OrangeSulfur",
      "shovelcat",
      "Lavafork",
      "truffleNitrate",
      "OliveGranite",
      "claylettuce",
      "CauliflowerSlate",
      "juniperRabbit",
      "HorseradishFlint",
      "cedarLimestone",
      "MarbleDeer",
      "ivyGypsum",
      "Maplesalt",
      "Ironcricket",
      "Pinecopper",
      "peatCat",
      "coalTin",
      "Sulfurlead",
      "zincViolet",
      "LavaMercury",
      "laurelNitrate",
      "GraniteSnowdrop",
      "clayaxe",
      "Slatebull",
      "sandstoneGrass",
      "HazelRabbit",
      "flintGoat",
      "VioletLimestone",
      "marbleWillow",
      "GypsumElm",
      "mandrakeSalt",
      "Irontuna",
      "copperDandelion",
      "CatTwine",
      "tinSleigh",
      "LeadHen",
      "zincBirch",
      "MercuryClove",
      "laurelParsnip",
      "HemlockCart",
      "radishAxe",
      "HawthornBull",
      "PineNightingale",
      "Hazeloak",
      "goatRose",
      "VioletWallflower",
      "willowSilkworm",
      "Elmcarp",
      "mandrakeDuck",
      "ParsleyScythe",
      "Thymetuna",
      "DandelionRadish",
      "quailtwine",
      "ElderberrySleigh",
      "tulipCarnation",
      "Hencart",
      "birchOat",
      "PeriwinkleRye",
      "Onionbee",
      "HemlockRosemary",
      "radishCucumber",
      "PigeonSickle",
      "hawthornArtchoke",
      "CorianderElm",
      "oakClove",
      "RosemaryLavender",
      "wallflowerMint",
      "SilkwormSage",
      "carpGarlic",
      "Wheatduck",
      "scytheRam",
      "ThymeBlackberry",
      "strawberryBasil",
      "QuailMarshmallow",
      "elderberryLock",
      "CarnationOtter",
      "cartMill",
      "OatPlum",
      "ryeSalmon",
      "OnionFennel",
      "IronRosemary",
      "CucumberFire",
      "sickleWalnut",
      "ArtichokeTrout",
      "corianderBasket",
      "CloveHazelnut",
      "lavenderHops",
      "MintNightmare",
      "sageghost",
      "GarlicArmor",
      "SnowWheat",
      "RainRam",
      "bearEmerald",
      "SilverAnchor",
      "Jadegold",
      "Shykind",
    ];

    for (let i = 0; i < names.length; i++) {
      let accountObj = {
        username: names[i],
        premium: true,
      };
      if (i % 14 == 0) {
        accountObj.premium = false;
      }

      for (let digits = 2; digits <= 7; digits++) {
        let average = Math.random() * 1.8 + 3.8 + 0.2 * digits;

        let numberOfGames = 30;
        if (i % 5 == 0) {
          numberOfGames = 15;
        }

        let currentDate = new Date("2120-10-10T08:58:15.643+00:00");
        let oldDate = new Date("2020-10-10T08:58:15.643+00:00");
        let date = currentDate;
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

  //createTestLeaderboard();

  //Updates the leaderboards for each random category on an hourly basis
  let updateLeaderboards = nodeCron.schedule(
    `*/5 * * * *`,
    async () => {
      const accountsDb = mongoClient.db("Accounts");
      let accounts = accountsDb.collection(`TestAccounts`);
      let premiumAccounts = await accounts.find({ premium: true }).toArray();
      const leaderboardsDb = mongoClient.db("Leaderboards");

      let todaysDate = new Date();
      let todaysTime = todaysDate.getTime();

      for (let digits = 2; digits <= 7; digits++) {
        let eligibleAccounts = [];
        premiumAccounts.forEach((x) => {
          try {
            let oldestDate = new Date(x[digits + `random-scores`].date);
            if (
              x[digits + `random-scores`].numberOfGames == 30 &&
              todaysTime - oldestDate.getTime() <= 1000 * 60 * 60 * 24 * 30
            ) {
              eligibleAccounts.push(x);
            } else {
            }
          } catch {}
        });

        eligibleAccounts = eligibleAccounts.sort(function (a, b) {
          return (
            a[digits + `random-scores`].average -
            b[digits + `random-scores`].average
          );
        });

        let leaderboard = leaderboardsDb.collection("Leaderboard-" + digits);
        //not sure if this will work
        await leaderboard.deleteMany({});

        let numberOfEntries = Math.min(50, eligibleAccounts.length);
        let currentAccount = eligibleAccounts[0];

        for (let i = 0; i < numberOfEntries; i++) {
          let currentAccount = eligibleAccounts[i];
          let leaderboardEntry = {
            rank: i + 1,
            username: currentAccount.username,
            average: currentAccount[digits + `random-scores`].average,
          };
          await leaderboard.insertOne(leaderboardEntry);
        }
      }
    },
    {
      scheduled: true,
      timezone: "America/New_York",
    }
  );

  updateLeaderboards.start();
}

module.exports = { scheduledTasks };

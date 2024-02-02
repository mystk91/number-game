//Requests that involve updating stats information about the site, such as visitor counts, game completes
//Also has admin functions
function adminRequests(app) {
  const bcrypt = require("bcryptjs");
  const uniqid = require("uniqid");
  const crypto = require("crypto");
  //Starting mongo
  const { MongoClient, Timestamp } = require("mongodb");
  let ObjectId = require("mongodb").ObjectId;
  const mongoClient = new MongoClient(process.env.mongoDB);

  //Sends a message to the admins message system so they can reply accordingly
  app.post("/api/contact-send-message", async (req, res, next) => {
    //Error Checking
    let errors = {
      message: "",
    };
    let errorFound = false;
    if (req.body.message.length <= 8) {
      errors.message = "Messages is too short";
      errorFound = true;
    }
    if (req.body.message.length > 800) {
      errors.message = "Messages is too long";
      errorFound = true;
    }

    //Adding message to DB
    if (errorFound) {
      res.send({ errors });
    } else {
      try {
        const accountsDb = mongoClient.db("Accounts");
        let accounts = accountsDb.collection("Accounts");
        const webDB = mongoClient.db("Website");
        let messages = webDB.collection("Messages");

        let account = await accounts.findOne({ session: req.body.session });

        if (account.messagesSent < 8) {
          await messages.insertOne({
            userId: account._id,
            username: account.username,
            email: account.email,
            premium: account.premium,
            spammer: account.spammer,
            subject: req.body.subject,
            message: req.body.message,
            date: new Date(),
          });

          await accounts.updateOne(
            { session: req.body.session },
            { $inc: { messagesSent: 1 } }
          );

          res.send({ success: true });
        } else {
          await messages.updateOne(
            { userId: account._id },
            {
              $set: {
                userId: account._id,
                username: account.username,
                email: account.email,
                premium: account.premium,
                spammer: account.spammer,
                subject: req.body.subject,
                message: req.body.message,
                date: new Date(),
              },
            }
          );

          res.send({ success: true });
        }
      } catch {
        errors.message = "Error sending message";
        res.send({ errors });
      }
    }
  });

  //Gets the site stats, leaderboards, and messages so they can be dealt with
  app.get("/api/admin-get-all-info", async (req, res, next) => {
    try {
      const accountsDB = mongoClient.db("Accounts");
      let accounts = accountsDB.collection("Accounts");
      let account = await accounts.findOne({
        _id: new ObjectId("6588d21be7f4b9e8a622b42a"),
      });

      //if (req.user.session == account.session) {}

      const webDB = mongoClient.db("Website");
      let Stats = webDB.collection("Stats");
      let visitors = await Stats.findOne({ title: "visitors" });
      let gamesCompleted = await Stats.findOne({ title: "gamesCompleted" });
      let premiumUsers = await Stats.findOne({ title: "premiumUsers" });

      let siteStats = {
        visitors: visitors.visitors,
        premiumUsers: premiumUsers.premiumUsers,
        gamesCompleted: gamesCompleted.gamesCompleted,
        randomGamesCompleted: gamesCompleted.randomGamesCompleted,
        dailyGamesCompleted: gamesCompleted.dailyGamesCompleted,
      };

      let allLeaderboards = {};
      const leaderboardDB = mongoClient.db("Leaderboards");
      for (let digits = 2; digits <= 7; digits++) {
        let leaderboard = await leaderboardDB
          .collection("Leaderboard-" + digits)
          .find()
          .toArray();
        allLeaderboards[`Leaderboard-` + digits] = leaderboard;
      }

      let resObj = {
        siteStats: siteStats,
        leaderboards: allLeaderboards,
      };

      res.send(resObj);
    } catch {
      res.send({ error: true });
    }
  });

  //A page that only admins can access
  app.get("/admin/secretAdmins", async (req, res, next) => {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({
        _id: new ObjectId("6588d21be7f4b9e8a622b42a"),
      });
      if (req.user.session == account.session) {
        next();
      } else {
        res.redirect("/login");
      }
    } catch {
      res.redirect("/login");
    }
  });

  //Gives a strike to an account and removes them from the leaderboard
  app.post("/admin/give-strike", async (req, res, next) => {
    try {
      const accountsDB = mongoClient.db("Accounts");
      let accounts = accountsDB.collection("Accounts");

      let leaderboardsDB = mongoClient.db("Leaderboards");

      let account = await accounts.findOne({
        _id: new ObjectId("6588d21be7f4b9e8a622b42a"),
      });

      //if (req.user.session == account.session) {
        if(true){
        await accounts.updateOne(
          {
            _id: new ObjectId(req.body.userId),
          },
          {
            $inc: { accountStrikes: 1 },
            $set: { shadowbanned: true },
          }
        );
        for (let i = 2; i <= 7; i++) {
          let leaderboardCollection = leaderboardsDB.collection(
            `Leaderboard-${i}`
          );
          await leaderboardCollection.deleteOne({
            userId: new ObjectId(req.body.userId),
          });
        }
        res.send({ success: true });
      } else {
        res.send({ error: true });
      }
    } catch {
      res.send({ error: true });
    }
  });

  //Adds fake accounts so they will be on the leaderboard, should only be used one time
  //Function and route should be commented out if its been used
  app.post("/admin/add-fake-accounts", async (req, res, next) => {
    const accountsDb = mongoClient.db("Accounts");
    let accounts = accountsDb.collection(`Accounts`);

    let account = await accounts.findOne({
      _id: new ObjectId("6588d21be7f4b9e8a622b42a"),
    });
    let fakeAccount = await accounts.findOne({
      fakeAccount: true,
    });

    //if (req.user.session == account.session) {}

    if (!fakeAccount) {
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
        "Riverfire",
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
        "KindEmerald",
      ];

      for (let i = 0; i < names.length; i++) {
        let accountObj = {
          username: names[i],
          premium: true,
        };
        if (i % 14 == 0) {
          accountObj.premium = false;
        }

        let shadowbanned = false;
        if (i % 29 == 0) {
          shadowbanned = true;
        }
        accountObj.shadowbanned = shadowbanned;

        let accountStrikes = 0;
        if (i % 17 == 1) {
          accountStrikes++;
        }
        accountObj.accountStrikes = accountStrikes;

        for (let digits = 2; digits <= 7; digits++) {
          let average = Math.random() * 1.4 + 4.2 + 0.2 * digits;

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
              average30: {
                average: average,
                numberOfGames: numberOfGames,
                date: date,
              },
            };
          }
        }

        accountObj.email = generateString(24) + "@fakemail";
        accountObj.password = generateString(24);
        accountObj.fakeAccount = true;
        accountObj.session = generateString(48);

        accounts.insertOne(accountObj);
      }
    }
  });

  //Removes all fake accounts from Accounts
  //Function and route should be commented out if its been used
  app.delete("/admin/remove-fake-accounts", async (req, res, next) => {
    const accountsDb = mongoClient.db("Accounts");
    let accounts = accountsDb.collection(`Accounts`);

    let account = await accounts.findOne({
      _id: new ObjectId("6588d21be7f4b9e8a622b42a"),
    });

    //if (req.user.session == account.session) {}

    accounts.deleteMany({ fakeAccount: true });
  });

  //Updates the test account, used for seeing how large the account can get
  app.post("/admin/update-test-account", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("Accounts");
    //if (req.user.session == account.session) {}

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
          best30: {
            average: average30,
            date: new Date(),
            scores: scores30Objects,
          },
        };

        accounts.updateOne(
          { email: "testAccount" },
          {
            $set: { [`${i}${gameTypes[j]}-scores`]: scoresObj },
          }
        );
      }
    }
  });

  //Adds the first games to the database if they don't exist, Only use when we have an empty game database. Probably will only use this once.
  app.post("/admin/add-first-games", async (req, res, next) => {
    const dbDailyGames = mongoClient.db("DailyGames");
    let dailyGames = dbDailyGames.collection(`DailyGames`);

    const accountsDb = mongoClient.db("Accounts");
    let accounts = accountsDb.collection("Accounts");

    //if (req.user.session == account.session) {}

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
      let targetNumber = Math.floor(Math.random() * Math.pow(10, i)).toString();
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
  });

  //addFirstGames();

  //Returns a random string, used for creating passwords and sessions
  function generateString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
}

module.exports = { adminRequests };

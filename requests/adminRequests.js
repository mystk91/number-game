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

  //Increments the visitor count when a new person visits the site without saved localstorage
  app.post("/api/add-visitor", async (req, res, next) => {
    const db = mongoClient.db("Website");
    let Stats = db.collection("Stats");
    Stats.updateOne({ title: "visitors" }, { $inc: { visitors: 1 } });
  });

  //Increments the total daily games played counter when a game is completed
  app.post("/api/update-game-count-daily", async (req, res, next) => {
    const db = mongoClient.db("Website");
    let Stats = db.collection("Stats");
    Stats.updateOne(
      { title: "gamesCompleted" },
      { $inc: { gamesCompleted: 1, dailyGamesCompleted: 1 } }
    );
  });

  //Increments the total random games played counter when a game is completed
  app.post("/api/update-game-count-random", async (req, res, next) => {
    const db = mongoClient.db("Website");
    let Stats = db.collection("Stats");
    Stats.updateOne(
      { title: "gamesCompleted" },
      { $inc: { gamesCompleted: 1, randomGamesCompleted: 1 } }
    );
  });

  //Increments the number of users that have purchase premium
  app.post("/api/add-premium-user", async (req, res, next) => {
    const db = mongoClient.db("Website");
    let Stats = db.collection("Stats");
    Stats.updateOne({ title: "visitors" }, { $inc: { premiumUsers: 1 } });
  });

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
        let accounts = accountsDb.collections("Accounts");
        const webDB = mongoClient.db("Website");
        let messages = webDB.collection("Messages");

        let account = await accounts.findOne({ session: req.body.session });

        if (account.messagesSent < 8) {
          await messages.insertOne({
            userId: account._id,
            username: account.username,
            email: account.email,
            premium: account.premium,
            subject: req.body.subject,
            message: req.body.message,
          });

          await account.updateOne(
            { session: req.body.session },
            { $inc: { messagesSent: 1 } }
          );

          res.send({ success: true });
        } else {
          await messages.updateOne(
            { session: req.body.session },
            {
              $set: {
                userId: account._id,
                username: account.username,
                email: account.email,
                premium: account.premium,
                subject: req.body.subject,
                message: req.body.message,
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

      console.log(resObj);

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
}

module.exports = { adminRequests };

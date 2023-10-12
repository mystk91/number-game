//Requests related to displaying the leaderboard for the game
function leaderboardRequests(app) {
  const bcrypt = require("bcryptjs");
  const uniqid = require("uniqid");
  const crypto = require("crypto");
  const nodemailer = require("nodemailer");
  //Starting mongo
  const { MongoClient, Timestamp } = require("mongodb");
  let ObjectId = require("mongodb").ObjectId;
  const mongoClient = new MongoClient(process.env.mongoDB);
  async function connectMongo() {
    await mongoClient.connect();
  }
  connectMongo();
}

module.exports = { leaderboardRequests };

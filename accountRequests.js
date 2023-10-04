//Requests that involve account creation, password resets and logins
function accountRequests(app) {
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

  //Authentication Constants
  const passport = require("passport");
  const session = require("express-session");
  app.use(
    session({
      name: "session0",
      secret: process.env.sessionSecret,
      maxAge: 24 * 60 * 60 * 100,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  //Local Strategy
  const LocalStrategy = require("passport-local").Strategy;

  //Google Authentication
  const GoogleStrategy = require("passport-google-oauth20");
  const Google_Client_Id = process.env.googleClientId;
  const Google_Client_Secret = process.env.googleClientSecret;

  /////////////////////
  /* Account Creation
  /* Creates a new unverified account and sends a verification email. */
  app.post("/api/create-account", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("Accounts");
    let unverifieds = db.collection("Unverified-Accounts");

    //Error checking
    let errors = {
      email: "",
      password: "",
    };
    let errorFound = false;

    //Checks if email address if valid
    let emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$"
    );
    if (!emailRegExp.test(req.body.email)) {
      errors.email = "Invalid email address";
      errorFound = true;
    }
    //Checks if email address already exists
    let dupeAccount = await accounts.findOne({ email: req.body.email });
    if (dupeAccount) {
      errors.email = "That email is already associated with an account";
      errorFound = true;
    }
    //Checks if password is valid
    let passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$"
    );
    if (!passwordRegExp.test(req.body.password)) {
      errors.password = `Passwords must be at least 8 characters and have an uppercase and lowercase letter, a number, and a special character.`;
    }
    if (errorFound) {
      res.send(errors);
    } else {
      //Creates the account if parameters are correct
      let random = Math.floor(Math.random() * 6) + 4;

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
      let verificationCode = generateString(32);

      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {
          const user = {
            email: req.body.email,
            password: hashedPassword,
            active: false,
            verificationCode: verificationCode,
            createdAt: new Date(),
          };
          await unverifieds.insertOne(user);
          //res.send(302);
        } catch (err) {}
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.nodemailerUser,
          pass: process.env.nodemailerPass,
        },
      });

      const mailOptions = {
        from: `"Numblr" <${process.env.nodemailerUser}>`,
        to: req.body.email,
        subject: "Numblr Email Verification",
        html: `</p> Click below to verify your email address. </p> <br>
        <a href='${process.env.protocol}${process.env.domain}/verify-email/${verificationCode}'>${process.env.protocol}${process.env.domain}/verify-email/${verificationCode}</a>
        <p>If you did not just sign up to Numblr, please ignore this.</p>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.sendStatus(200);
        }
      });
    }
  });

  /////////////////////
  /* Email Verification 
  /* Verifies the email if user goes to verification URL */
  app.post("/api/verify-email/:verificationCode", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("Accounts");
    let unverifieds = db.collection("Unverified-Accounts");

    let vCode = req.params["verificationCode"];

    const user = await unverifieds.findOne({ verificationCode: vCode });

    const newestVerificationCode = await unverifieds.find({email: user.email}).sort({createdAt: 1}).limit(1);

    if (user === newestVerificationCode) {
      const verifiedUser = {
        email: user.email,
        password: user.password,
        active: true,
      };
      await accounts.insertOne(verifiedUser);
      console.log("sucess");
      res.status(200);
      res.end();
    } else {
      console.log("failure");
      res.status(400);
    }
  });

  /////////////////////
  /* Reset Password / Forgot Password
  /* Sends a password reset link to to a verified email */
  app.post("/api/forgot-password", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("accounts");
    let needsReset = db.collection("needs-password-reset");

    //Error checking
    let errors = {
      email: "",
    };
    let errorFound = false;

    //Checks if email address if valid
    let emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$"
    );
    if (!emailRegExp.test(req.body.email)) {
      errors.email = "Invalid email address";
      errorFound = true;
    } else {
      //Checks if email address exists
      let accountExists = await accounts.findOne({ email: req.body.email });
      if (!accountExists) {
        errors.email = "There is no account associated with that email";
        errorFound = true;
      }
    }

    if (errorFound) {
      res.send(errors);
    } else {
      //Sends a password reset if the email address exists
      let random = Math.floor(Math.random() * 6) + 4;

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
      let verificationCode = generateString(32);

      const user = {
        email: req.body.email,
        verificationCode: verificationCode,
        createdAt: new Date(),
      };
      await needsReset.insertOne(user);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.nodemailerUser,
          pass: process.env.nodemailerPass,
        },
      });

      const mailOptions = {
        from: `"Numblr" <${process.env.nodemailerUser}>`,
        to: req.body.email,
        subject: "Numblr Password Reset",
        html: `<p>Click here to reset your password. If you didn't request a password reset, you can ignore this. </p>
        <a href='${process.env.protocol}${process.env.domain}/change-password/${verificationCode}'>${process.env.protocol}${process.env.domain}/reset-password/${verificationCode}</a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  });

  /////////////////////
  /* Changing Password / New Password
  /* Handles the form that inputs the changed password */
  app.get("/api/change-password", async (req, res, next) => {
    let newPassword = req.body.password;

    //Error checking
    let errors = {
      password: "",
    };
    let errorFound = false;

    //Checks if password is valid
    let passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$"
    );
    if (!passwordRegExp.test(req.body.password)) {
      errors.password = `Passwords must be at least 8 characters and have an uppercase and lowercase letter, a number, and a special character.`;
    }

    if (errorFound) {
      res.send(errors);
    } else {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("accounts");
      let needsReset = db.collection("needs-password-reset");

      const needsResetUser = await needsReset.findOne({
        verificationCode: verificationCode,
      });

      if (needsResetUser) {
        const user = await accounts.findOne({ email: needsResetUser.email });
        if (user) {
          bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
            try {
              await accounts.updateOne(
                { email: needsResetUser.email },
                { $set: { password: hashedPassword } }
              );
              res.send(302);
            } catch (err) {}
          });
        } else {
          res.status(400);
        }
      } else {
        res.status(400);
      }
    }
  });

  //Google Authentication
  app.get(
    "/login/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID: Google_Client_Id,
        clientSecret: Google_Client_Secret,
        callbackURL: `${process.env.protocol}${process.env.domain}/login/google/callback`,
      },
      async function (accessToken, refreshToken, profile, done) {
        const db = mongoClient.db("Website");
        let accounts = db.collection("accounts");
        let account = await accounts.findOne({ email: profile.email });
        if (!account) {
          let password = await bcrypt.hash(uniqid(), 10);
          let newAccount = {
            username: profile.name.givenName,
            email: profile.email,
            password: password,
            googleId: profile.id,
          };
          await accounts.insertOne(newAccount);
          newAccount = await accounts.findOne({ googleId: profile.id });
          done(null, newAccount);
        } else {
          if (!account.googleId) {
            await accounts.updateOne(
              { email: profile.email },
              {
                $set: {
                  googleId: account.googleId,
                  username: profile.name.givenName,
                },
              }
            );
          }
          done(null, account);
        }
      }
    )
  );

  app.get(
    "/login/google/callback",
    passport.authenticate("google", { failureRedirect: "/signup" }),
    async function (req, res) {
      res.redirect(`${process.env.protocol}${process.env.domain}`);
    }
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get("/api/current_user", async (req, res) => {
    res.json(req.user);
  });
}

module.exports = { accountRequests };

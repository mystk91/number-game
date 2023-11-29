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

  //Authentication Constants
  const passport = require("passport");
  const session = require("express-session");
  app.use(
    session({
      name: "session",
      secret: process.env.sessionSecret,
      maxAge: 365 * 24 * 60 * 60 * 1000,
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
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{10,32}$"
    );
    if (!passwordRegExp.test(req.body.password)) {
      errors.password = `Passwords must have at least 10 characters, an upper and
      lowercase letter, and a number or special character.`;
    }
    if (errorFound) {
      res.status(400).send(errors);
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

    const unverifiedUser = await unverifieds.findOne({
      verificationCode: vCode,
    });

    if (unverifiedUser) {
      const newestUnverifiedAccount = unverifieds
        .find({ email: unverifiedUser.email })
        .sort({ createdAt: -1 })
        .limit(1);

      const arr = await newestUnverifiedAccount.toArray();
      let newestVerificationCode = arr[0].verificationCode;

      const previouslyCreatedAccount = await accounts.findOne({
        email: unverifiedUser.email,
      });

      if (
        unverifiedUser.verificationCode === newestVerificationCode &&
        !previouslyCreatedAccount
      ) {
        const verifiedUser = {
          email: unverifiedUser.email,
          password: unverifiedUser.password,
          createdAt: new Date(),
        };
        await accounts.insertOne(verifiedUser);
        res.sendStatus(200);
        res.end();
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  });

  /////////////////////
  /* Reset Password / Forgot Password
  /* Sends a password reset link to to a verified email */
  app.post("/api/forgot-password", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("Accounts");
    let needsReset = db.collection("Needs-Password-Reset");

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
      res.status(400).send(errors);
    } else {
      try {
        await accounts.updateOne(
          { email: req.body.email },
          { $set: { needsPasswordReset: true } }
        );
      } catch {
        res.sendStatus(400);
      }
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
        <a href='${process.env.protocol}${process.env.domain}/new-password/${verificationCode}'>${process.env.protocol}${process.env.domain}/reset-password/${verificationCode}</a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.sendStatus(200);
          console.log("Email sent: " + info.response);
        }
      });
    }
  });

  /////////////////////
  /* Changing Password / New Password
  /* Handles the form that inputs the changed password */
  app.post("/api/change-password", async (req, res, next) => {
    let newPassword = req.body.password;
    let vCode = req.body.verificationCode;

    //Error checking
    let errors = {
      password: "",
      errorFound: false,
    };
    let errorFound = false;

    //Checks if password is valid
    let passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{10,32}$"
    );
    if (!passwordRegExp.test(newPassword)) {
      errors.password = `Passwords must have at least 10 characters, an upper and
      lowercase letter, and a number or special character.`;
      errors.errorFound = true;
    }

    if (errors.errorFound) {
      res.status(400).send(errors);
    } else {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let needsReset = db.collection("Needs-Password-Reset");

      const needsResetUser = await needsReset.findOne({
        verificationCode: vCode,
      });

      if (needsResetUser) {
        try {
          const user = await accounts.findOne({ email: needsResetUser.email });
          if (user.needsPasswordReset) {
            bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
              await accounts.updateOne(
                { email: needsResetUser.email },
                {
                  $set: {
                    password: hashedPassword,
                    needsPasswordReset: false,
                  },
                }
              );
              res.sendStatus(200);
            });
          } else {
            res.status(400).send(errors);
          }
        } catch {
          res.status(400).send(errors);
        }
      } else {
        res.status(400).send(errors);
      }
    }
  });

  //Local Strategy Authentication
  //Logs a user in
  app.post(
    "/api/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),
    (req, res) => {
      res.sendStatus(302);
    }
  );

  //Validates form and then sends to /api/login if successful
  app.post("/api/validate", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("Accounts");
    let errors = {
      email: "",
      password: "",
      errorFound: false,
    };
    //Error Checking
    let errorExists = false;
    const user = await accounts.findOne({ email: req.body.email });
    if (!user) {
      errors.email = "No account exists with that email";
      errors.errorFound = true;
    } else {
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.sendStatus(302);
      } else {
        errors.password = "Incorrect password";
        errors.errorFound = true;
      }
    }
    if (errors.errorFound) {
      res.send(errors);
    }
  });

  //Local strategy to log user in at /api/login
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const db = mongoClient.db("Accounts");
        let accounts = db.collection("Accounts");
        let errors = {
          email: "",
          password: "",
        };
        //Error Checking
        let errorExists = false;
        const user = await accounts.findOne({ email: email });
        let newUser = {};
        if (!user) {
          errors.email = "No account exists with that email.";
          errorExists = true;
        } else {
          if (await bcrypt.compare(password, user.password)) {
            const characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&";
            function generateString(length) {
              let result = "";
              const charactersLength = characters.length;
              for (let i = 0; i < length; i++) {
                result += characters.charAt(
                  Math.floor(
                    (characters.length *
                      crypto.getRandomValues(new Uint32Array(1))) /
                      Math.pow(2, 32)
                  )
                );
              }
              return result;
            }
            let session = generateString(48);
            newUser.session = session;
            newUser.loginType = "email";
          } else {
            errors.password = "Wrong password. Try again.";
            errorExists = true;
          }
        }

        if (errorExists) {
          return done(null, false, errors);
        } else {
          accounts.updateOne(
            { _id: user._id },
            { $set: { session: newUser.session } }
          );
          return done(null, newUser);
        }
      }
    )
  );

  //Logs the user out
  app.post("/api/logout", (req, res, next) => {
    req.logout(function (err) {
      //if (err) { return next(err); }
      res.sendStatus(302);
    });
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
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&";
        function generateString(length) {
          let result = "";
          const charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
            result += characters.charAt(
              Math.floor(
                (characters.length *
                  crypto.getRandomValues(new Uint32Array(1))) /
                  Math.pow(2, 32)
              )
            );
          }
          return result;
        }
        let session = generateString(48);
        let returnedAccount = {
          googleProfilePicture: profile.photos[0].value,
          googleUsername: profile.name.givenName,
          loginType: "google",
          session: session,
        };
        const db = mongoClient.db("Accounts");
        let accounts = db.collection("Accounts");
        let account = await accounts.findOne({ googleId: profile.id });
        console.log(profile.email);
        if (!account) {
          account = await accounts.findOne({ email: profile.emails[0].value });
        }
        if (!account) {
          let password = await bcrypt.hash(uniqid(), 10);
          let newAccount = {
            email: profile.emails[0].value,
            googleId: profile.id,
            password: password,
            session: session,
          };
          await accounts.insertOne(newAccount);
          done(null, returnedAccount);
        } else {
          if (!account.googleId) {
            await accounts.updateOne(
              { email: profile.emails[0].value },
              {
                $set: {
                  googleId: profile.id,
                  session: session,
                },
              }
            );
          } else {
            await accounts.updateOne(
              { googleId: profile.id },
              {
                $set: {
                  session: session,
                },
              }
            );
          }
          done(null, returnedAccount);
        }
      }
    )
  );

  app.get(
    "/login/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async function (req, res) {
      res.redirect(`${process.env.protocol}${process.env.domain}`);
    }
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    if (user.session) {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let sessionUser = await accounts.findOne({ session: user.session });
      if (sessionUser) {
        done(null, user);
      } else {
        done(null, null);
      }
    } else {
      done(null, null);
    }
  });

  //Returns the info of the current user
  app.get("/api/current_user", async (req, res) => {
    res.json(req.user);
  });

  //Checks if user has premium, returns {premium: true} if they do
  app.get("/api/checkPremium", async (req, res) => {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({ session: req.user.session });
      if (account.premium == true) {
        res.send({
          premium: true,
        });
      } else {
        res.send({});
      }
    } catch {
      res.send({});
    }
  });

  //Retuns the profile image link of the user, returns a default picture otherwise
  app.get("/api/profile_picture", async (req, res) => {
    try {
      if (req.user.loginType == "email") {
        res.send({
          loggedIn: true,
          imageUrl: "./images/account/profile-images/logged-in.png",
        });
      } else if (req.user.loginType == "google") {
        res.send({
          loggedIn: true,
          imageUrl: req.user.googleProfilePicture,
        });
      } else {
        res.send({
          loggedIn: false,
          imageUrl: "./images/site/account2.png",
        });
      }
    } catch {
      res.send({
        loggedIn: false,
        imageUrl: "./images/site/account2.png",
      });
    }
  });
}

module.exports = { accountRequests };

//Requests that involve account creation, password resets and logins
function accountRequests(app) {
  /////////////////////
  /* Creates a new unverified account and sends a verification email. */
  app.post("/api/create-account", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("accounts");
    let unverifieds = db.collection("unverified-accounts");

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
    if (!passwordRegExp.test(passwordValue)) {
      errors.password =
        "Needs an uppercase and lowercase letter, a number, and a special character";
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
            id: req.body.email,
            email: req.body.email,
            password: hashedPassword,
            active: false,
            verificationCode: verificationCode,
            createdAt: new Timestamp(),
          };
          await unverifieds.insertOne(user);
          res.send(302);
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
        html: `<p>If you didn't sign up to this website, please ignore this. Otherwise, click here to verify your email address. </p>
        <a href='${process.env.protocol}${process.env.domain}/verify-email/${verificationCode}'>${process.env.protocol}${process.env.domain}/verify-email/${verificationCode}</a>`,
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
  /* Email Verification 
  /* Verifies the email if user goes to verification URL */
  app.get("/verify-email/:verificationCode", async (req, res, next) => {
    const db = mongoClient.db("Accounts");
    let accounts = db.collection("accounts");
    let unverifieds = db.collection("unverifieds");

    let vCode = req.params["verificationCode"];

    const user = await unverifieds.findOne({ verificationCode: vCode });

    if (user) {
      const verifiedUser = {
        email: user.email,
        password: user.password,
        active: true,
      };
      await accounts.insertOne(verifiedUser);
      await unverifieds.deleteOne({ verificationCode: vCode });
      res.status(200);
      res.end();
    } else {
      res.status(400);
    }
  });

  /////////////////////
  /* Password Reset
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

      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {
          const user = {
            email: req.body.email,
            verificationCode: verificationCode,
            createdAt: new Timestamp(),
          };
          await needsReset.insertOne(user);
          res.send(302);
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
        subject: "Numblr Password Reset",
        html: `<p>Click here to reset your password. If you didn't request a password reset, you can ignore this. </p>
        <a href='${process.env.protocol}${process.env.domain}/reset-password/${verificationCode}'>${process.env.protocol}${process.env.domain}/reset-password/${verificationCode}</a>`,
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
}

module.exports = { accountRequests };

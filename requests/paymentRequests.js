//Handles payments with Stripe
function paymentRequests(app, bodyParser) {
  const bcrypt = require("bcryptjs");
  const uniqid = require("uniqid");
  const crypto = require("crypto");
  //const setTimeout = require("timers/promises");
  const nodemailer = require("nodemailer");
  //Starting mongo
  const { MongoClient, Timestamp } = require("mongodb");
  let ObjectId = require("mongodb").ObjectId;
  const mongoClient = new MongoClient(process.env.mongoDB);

  const stripe = require("stripe")(process.env.secretKey);

  const YOUR_DOMAIN = `${process.env.protocol}${process.env.domain}/products/random-mode`;

  app.post("/create-checkout-session", async (req, res) => {
    try {
      const db = mongoClient.db("Accounts");
      let accounts = db.collection("Accounts");
      let account = await accounts.findOne({
        session: req.body.session,
      });

      if (account._id) {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: process.env.randomMode,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.protocol}${process.env.domain}/random5`,
          cancel_url: `${process.env.protocol}${process.env.domain}`,
          metadata: { _id: account._id.toString() },
        });
        res.send({ url: session.url });
      } else {
        res.redirect(303, "/login");
      }
    } catch (error) {
      res.redirect(303, "/login");
    }
  });

  const endpointSecret = process.env.endpointSecret;

  app.post(
    "/complete-premium-purchase",
    bodyParser.raw({ type: "application/json" }),
    async (request, response) => {
      const payload = request.body;
      const sig = request.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
      }
      // Handle the checkout.session.completed event
      if (event.type === "checkout.session.completed") {
        // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
        try {
          const session = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
              expand: ["line_items"],
            }
          );
          let _id = new ObjectId(session.metadata._id);
          // Fulfill the purchase...
          const eventObj = event.data.object;
          if (eventObj.payment_status === "paid") {
            async function fulfillOrder(_id) {
              try {
                const db = mongoClient.db("Accounts");
                let accounts = db.collection("Accounts");
                await accounts.updateOne(
                  { _id: _id },
                  { $set: { premium: true } }
                );

                const webDb = mongoClient.db("Website");
                let stats = db.collection("Stats");
                await stats.updateOne(
                  {
                    title: "premiumUsers",
                  },
                  {
                    $inc: {
                      premiumUsers: 1,
                    },
                  }
                );
                return true;
              } catch {
                return false;
              }
            }
            let success = false;
            let attempts = 0;
            while (!success && attempts < 3) {
              success = await fulfillOrder(_id);
              if (!success) {
                attempts++;
                //Adds a delay before retry attempt
                await new Promise((resolve) => setTimeout(resolve, 5000));
                //await setTimeout(5000);
              }
            }
            if (success) {
              const db = mongoClient.db("Accounts");
              let accounts = db.collection("Accounts");
              let account = await accounts.findOne({ _id: _id });
              //Sending an email confirmation that the purchase was successful
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.nodemailerUser,
                  pass: process.env.nodemailerPass,
                },
              });
              const mailOptions = {
                from: `"Numbler" <${process.env.nodemailerUser}>`,
                to: account.email,
                subject: "Random Mode! ",
                html: `</p> You have successfully signed up for Random Mode!</p>
                <p>You can switch between Daily Mode and Random Mode by clicking the calendar/dice icons respectively. </p> 
                <a href="${process.env.protocol}${process.env.domain}/random5">${process.env.protocol}${process.env.domain}/random5</a>
              `,
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  //console.log(error);
                } else {
                  //console.log("Email sent: " + info.response);
                }
              });
            } else {
              //We will send an email to the admins account to notify them that something went wrong
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.nodemailerUser,
                  pass: process.env.nodemailerPass,
                },
              });
              const mailOptions = {
                from: `"Numbler" <${process.env.nodemailerUser}>`,
                to: "someAdminEmail@numbler.net",
                subject: "Random Mode Signup Error",
                html: `</p> Something went wrong for someone signing up to random mode. </p> 
              <p>Their user id was ${_id} </p>
              `,
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  //console.log(error);
                } else {
                  //console.log("Email sent: " + info.response);
                }
              });
            }
          }
        } catch (error) {
          //console.log(error);
          //We will send an email to the admins account to notify them that something went wrong
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.nodemailerUser,
              pass: process.env.nodemailerPass,
            },
          });
          const mailOptions = {
            from: `"Numbler" <${process.env.nodemailerUser}>`,
            to: "someAdminEmail@numbler.net",
            subject: "Random Mode Signup Error",
            html: `</p> Something went wrong for someone signing up to random mode. </p> 
            <p>Their user id was ${_id} </p>
            `,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              //console.log(error);
            } else {
              //console.log("Email sent: " + info.response);
            }
          });
        }
      }
      response.status(200).end();
    }
  );
}

module.exports = { paymentRequests };

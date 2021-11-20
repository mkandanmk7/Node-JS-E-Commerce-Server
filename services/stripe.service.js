const stripe = require("stripe")(process.env.STRIPE_KEY);

const service = {
  async payment(req, res) {
    console.log(req.body);
    stripe.charges.create(
      {
        source: req.body.tokenId,
        amount: req.body.amount,
        description: "payment for makeyouup",
        currency: "inr",
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          console.log(stripeErr);
          res.status(500).send(stripeErr);
        } else {
          res.status(200).send(stripeRes);
        }
      }
    );
  },
};
module.exports = service;

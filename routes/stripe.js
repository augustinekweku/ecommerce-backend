const router = require("express").Router();
// const stripe = require("stripe")(process.env.STRIPE_KEY);
const  KEY = process.env.STRIPE_KEY
const stripe = require("stripe")('sk_test_51H5VchKAVWDj3knqS7fgL4zFiq0V85KrbOWo0pZuIhbqbNQm9QIdt7tYhaI2IztpFmfzoYqCdvKPCchNx28XZEsi00kmbwhu5J');

router.post("/payment", (req, res) => {
    console.log("testing stripe route")
  stripe.charges.create(
    {
      source: 'tok_visa',
      amount: req.body.amount,
      currency: "usd",

    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;

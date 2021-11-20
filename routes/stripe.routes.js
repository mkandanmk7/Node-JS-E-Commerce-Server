const router = require("express").Router();
const service = require("../services/stripe.service");

router.post("/payment", service.payment);

module.exports = router;

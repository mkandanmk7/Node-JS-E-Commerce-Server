const router = require("express").Router();

const service = require("../services/auth.service");

//register
router.post("/register", service.register);

//login
router.post("/login", service.login);

//gen resetpass token
router.post("/resettoken", service.resetToken);

//verify and update pass;
router.post(
  "/verifyAndUpdatePassword/:userid/:token",
  service.verifyAndUpdatePassword
);

module.exports = router;

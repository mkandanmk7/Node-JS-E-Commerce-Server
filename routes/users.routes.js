const router = require("express").Router();
const service = require("../services/users.service");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../services/verifyToken.service");

//update
router.put("/:id", verifyTokenAndAuthorization, service.updateUser);
//delete

//get user with id
router.get("/find/:id", verifyTokenAndAdmin, service.getUser);

//get all user

//stats

module.exports = router;

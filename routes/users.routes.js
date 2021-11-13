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
router.delete("/:id", verifyTokenAndAuthorization, service.deleteUser);

//get user with id
router.get("/find/:id", verifyTokenAndAdmin, service.getUser);

//get all user
router.get("/", verifyTokenAndAdmin, service.getAllUser);

//stats
router.get("/stats", verifyTokenAndAdmin, service.userStats);

module.exports = router;

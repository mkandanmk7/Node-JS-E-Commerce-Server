const router = require("express").Router();
const service = require("../services/cart.service");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../services/verifyToken.service");

//create
router.post("/", verifyToken, service.createCart);

//update
router.put("/:id", verifyTokenAndAuthorization, service.updateCart);

//delete
router.delete("/:id", verifyTokenAndAuthorization, service.deleteCart);

//get user cart
router.get("/find/:userid", verifyTokenAndAuthorization, service.getCart);

//get all user cart
router.get("/", verifyTokenAndAdmin, service.getAllCart);
module.exports = router;

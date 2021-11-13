const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../services/verifyToken.service");
const service = require("../services/products.service");

//create
router.post("/", verifyTokenAndAdmin, service.createProduct);

//update
router.put("/:id", verifyTokenAndAuthorization, service.updateProduct);

//delete
router.delete("/:id", verifyTokenAndAuthorization, service.deleteProduct);

//get
router.get("/find/:id", service.getProduct);

//get all
router.get("/", service.getAllProduct);

module.exports = router;

const db = require("../shared/mongo");
const { ObjectId } = require("mongodb");
const { productSchema } = require("../shared/schema");

const service = {
  //create product
  async createProduct(req, res) {
    console.log("process started");

    try {
      const { value, error } = await productSchema.validate(req.body);
      if (error)
        return res.status(400).send({ Error: error.details[0].message });
      const product = await db.products.insertOne(value);

      res.status(200).send({ Message: "product created", product });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //update product
  async updateProduct(req, res) {
    console.log("process started");
    try {
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  //detele product
  async deleteProduct(req, res) {
    console.log("process started");
    try {
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  //get product
  async getProduct(req, res) {
    console.log("process started");
    try {
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  //get all prouducts
  async getAllProduct(req, res) {
    console.log("process started");
    try {
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = service;

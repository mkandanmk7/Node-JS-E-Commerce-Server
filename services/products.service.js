const db = require("../shared/mongo");
const { ObjectId } = require("bson");
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
      console.log(req.params.id);
      const updatedProduct = await db.products.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
        { ReturnDocument: "after" }
      );
      console.log(updatedProduct);

      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  //detele product
  async deleteProduct(req, res) {
    console.log("process started");

    try {
      await db.products.deleteOne({ _id: ObjectId(req.params.id) });

      res.status(200).send("product deleted");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  //get product
  async getProduct(req, res) {
    console.log(" get process started");
    try {
      const product = await db.products.findOne({
        _id: ObjectId(req.params.id),
      });
      console.log(req.params.id);
      console.log(product);
      //   console.log(product); //products details
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async getAllProduct(req, res) {
    try {
      if (Object.keys(req.query).length === 0) {
        let products = await db.products.find().toArray();
        res.status(200).send(products);
      } else {
        let query = {};
        query["$and"] = [];
        let sort, products;
        for (let key in req.query) {
          console.log(key, req.query);
          if (key === "sort") {
            sort = req.query[key];
          } else if (key === "name") {
            query["$and"].push({
              name: { $regex: req.query[key], $options: "i" },
            });
          } else if (key === "price") {
            values = req.query[key].split(",");
            values = values.map((a) => parseInt(a));
            query["$and"].push({ [key]: { $lt: values[1], $gte: values[0] } });
          } else {
            query["$and"].push({ [key]: { $in: req.query[key].split(",") } });
          }
        }

        console.log(query);

        if (sort && query["$and"].length == 0) {
          sort === "high"
            ? (products = await db.products
                .find()
                .sort({ price: -1 })
                .toArray())
            : (products = await db.products
                .find()
                .sort({ price: 1 })
                .toArray());
        } else if (sort && query["$and"].length > 0) {
          sort === "high"
            ? (products = await db.products
                .find(query)
                .sort({ price: -1 })
                .toArray())
            : (products = await db.products
                .find(query)
                .sort({ price: 1 })
                .toArray());
        } else products = await db.products.find(query).toArray();
        res.status(200).send(products);
      }
    } catch (err) {
      console.log("Error in fetching all Products", err);
      res.status(500).send(err);
    }
  },
};

module.exports = service;

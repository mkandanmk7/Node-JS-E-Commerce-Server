const db = require("../shared/mongo");
const { userRegisterSchema, userLoginSchema } = require("../shared/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { ObjectId } = require("mongodb");
const sendMail = require("../shared/sendMailer");

const service = {
  async register(req, res) {
    console.log("register process");
    try {
      const { value, error } = userRegisterSchema.validate(req.body);
      console.log(value, error);
      //error in schema strucuture
      if (error)
        return res.status(400).send({ Error: error.details[0].message });

      //check user exist?
      let userExist = await db.users.findOne({ email: value.email });
      if (userExist)
        return res.status(400).send({ Error: "user already exist" });

      value.password = await bcrypt.hash(value.password, Number(12));
      //if(!value.isAdmin)  value={...value,isAdmin:false}
      let newUser = { ...value, createdAt: new Date() };
      const insertData = await db.users.insertOne(newUser);
      console.log("new user registered");
      res.status(201).send("user Registered");
    } catch (error) {
      console.log("error in register", err);
      res.status(500).send({ err });
    }
  },
};

module.exports = service;

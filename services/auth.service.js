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
      console.log("new user registered", insertData);
      res.status(201).send("user Registered");
    } catch (error) {
      console.log("error in register", err);
      res.status(500).send({ err });
    }
  },

  //login
  async login(req, res) {
    try {
      const { value, error } = userLoginSchema.validate(req.body);

      //check user exist
      const userExist = await db.users.findOne({ email: value.email });
      if (!userExist)
        return res.status(400).send("user not found, try register");

      //check password
      const isValid = await bcrypt.compare(value.password, userExist.password);
      if (!isValid) return res.status(400).send("incorrect password");

      //gen token;
      const token = await jwt.sign(
        {
          userId: userExist._id,
          username: userExist.username,
          isAdmin: userExist.isAdmin,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "8h" }
      );
      // password not visible in response
      const { password, ...others } = userExist;
      console.log(others);

      res.status(200).send({ token, ...others });
    } catch (error) {
      console.log("error in login", error);
      res.status(500).send("Error in login");
    }
  },

  //reset token
  async resetToken(req, res) {
    try {
      const user = await db.users.findOne({ email: req.body.email });
      console.log(user);
      if (!user) return res.status(400).send("user doesn't exist");
      if (user.restToken) {
        let removeToken = await db.users.update(
          { email: user.email },
          { $unset: { resetToken: 1, resetExpire: 1 } }
        );
      }
      let token = crypto.randomBytes(32).toString("hex"); //gen random string for token
      //hash token to store in db
      const hashedToken = await bcrypt.hash(token, Number(12));

      console.log(token, "hashed", hashedToken);

      //expire of token for 1hour
      let expire = new Date(Date.now() + 1 * 3600 * 1000); //current time +60mins

      const data = await db.users.findOneAndUpdate(
        { email: user.email },
        { $set: { resetToken: hashedToken, resetExpire: expire } },
        { ReturnDocument: "after" }
      );

      const link = `https://muth-ecommerce-client.netlify.app/resetpassword/${user._id}/${token}`;
      await sendMail(user.email, "password reset", link);
      res
        .status(200)
        .send({ message: "Link sent to your email, Check it", link });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  //verify token and change pass
  async verifyAndUpdatePassword(req, res) {
    try {
      console.log(req.params.userid);
      console.log("userId :", req.params.userId);
      //use id
      console.log("update process");
      let user = await db.users.findOne({ _id: ObjectId(req.params.userid) });
      if (!user.resetToken)
        return res.status(400).send("invalid or expired link");
      let token = req.params.token; //from url token;
      console.log(token);
      const isValidToken = await bcrypt.compare(token, user.resetToken); // if same returns true;
      console.log(isValidToken);
      const isExpired = user.resetExpire > Date.now();
      console.log(user.resetExpire);
      console.log(Date.now(), user.resetExpire.getTime(), isExpired);

      if (isValidToken && isExpired) {
        const hashedPassword = await bcrypt.hash(req.body.password, Number(12));
        let newPass = await db.users.findOneAndUpdate(
          { _id: ObjectId(req.params.userid) },
          {
            $set: { password: hashedPassword },
            $unset: { resetToken: 1, resetExpire: 1 },
          },
          { ReturnDocument: "after" }
        );
        res.status(200).send("password updated successfully");
      } else return res.status(400).send("link invalid or expired");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = service;

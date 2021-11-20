require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongo = require("./shared/mongo");
const app = express();

//routes modules imports
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const productRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/orders.routes");
const stripeRoutes = require("./routes/stripe.routes");
(async () => {
  try {
    app.use(cors());
    app.use(express.json());
    await mongo.connect(); //call the mongo connect() for run db

    const port = process.env.PORT || 3001;

    app.get("/", (req, res) => {
      res.status(200).send("Server is running successfully ");
    });

    //middlewares
    app.use("/auth", authRoutes);

    app.use("/users", userRoutes);

    app.use("/product", productRoutes);

    app.use("/cart", cartRoutes);

    app.use("/order", orderRoutes);

    app.use("/checkout", stripeRoutes);
    //server starter
    app.listen(port, () => {
      console.log(`server running at ${port}`);
    });
  } catch (error) {
    console.log("error in connecting db", error);
  }
})();

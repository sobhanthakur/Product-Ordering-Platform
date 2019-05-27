const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Import the routes
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

const config = require("./api/config/config");

// Connect to mongo atlas
mongoose.connect(
  "mongodb+srv://" +
    config.MONGO_ATLAS_USERNAME +
    ":" +
    config.MONGO_ATLAS_PWD +
    "@cluster0-gegfo.mongodb.net/test?retryWrites=true"
);

mongoose.Promise = global.Promise;

const morgan = require("morgan"); // For logging
const bodyParser = require("body-parser");

app.use("/uploads", express.static("uploads"));

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  // Allows all websites
  res.header("Access-Control-Allow-Origin", "*");

  // Allows only this website
  // res.header("Access-Control-Allow-Origin", "https://mywebsite.com");

  // res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Authorization, Accept"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Headers", "GET,PUT,POST,PATCH,DELETE");
    res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// Middle-wares
// Throw Route not found exception
app.use((req, res, next) => {
  const error = new Error("Route Not found");
  error.status = 404;
  next(error);
});

// Else throw 500 error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

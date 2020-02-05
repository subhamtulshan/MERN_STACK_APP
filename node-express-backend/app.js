const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const placeRoute = require("./Routes/Places-routes");
const HttpsError = require("./Models/https-error");
const userRoute = require("./Routes/Users-routes");

const app = express();

app.use("/api/places", placeRoute);

app.use("/api/users", userRoute);

app.use((req, res, next) => {
  const error = new HttpsError("route not found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "something went wrong" });
});

mongoose
  .connect(
    "mongodb+srv://subham:CgbAbBEjwyOwxatL@cluster0-jmkjg.mongodb.net/products_test?retryWrites=true&w=majority"
  )
  .then(app.listen("5000"))
  .catch(error => {
    return new HttpsError("not able to connect to the database", 404);
  });

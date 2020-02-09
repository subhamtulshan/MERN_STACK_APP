const express = require("express");
const bodyparser = require("body-parser");
const { check } = require("express-validator");

const route = express.Router();

const userController = require("../Controllers/User-controllers");

route.use(bodyparser.json());


route.get("/", userController.getAllUsers);

route.post(
  "/signup",
  [
    check("name")
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail()
      .isEmail(),
    check("password").isLength({ min: 5 })
  ],
  userController.signUpuser
);

route.post(
  "/login",
  [
    check("email")
      .normalizeEmail()
      .isEmail(),
    check("password").isLength({ min: 5 })
  ],
  userController.loginUser
);

module.exports = route;

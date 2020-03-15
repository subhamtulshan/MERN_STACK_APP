const uuid = require("uuid");
const { validationResult } = require("express-validator");
const bycryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const HttpsError = require("../Models/https-error");
const User = require("../Models/User");
const SECRET_KEY = "super_secret_key_share_and_die";
const getUserbyId = (req, res, next) => {
  const userId = req.params.uid;
  const user = USERS.find(u => (u.id = userId));

  if (!user) {
    const error = new HttpsError(
      "cannot find the place with given placeid",
      404
    );
    throw error;
  }

  res.json(user);
};

const getAllUsers = async (req, res, next) => {
  let Users;
  try {
    Users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpsError("something went wrong", 500));
  }
  res.json({ User: Users.map(u => u.toObject({ getters: true })) });
};

const signUpuser = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new HttpsError("Inputs are not valid", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpsError("something went wrong", 500));
  }

  if (existingUser) {
    return next(new HttpsError("email already exists", 404));
  }

  let hashPassword;

  try {
    hashPassword = await bycryptjs.hash(password, 12);
  } catch (err) {
    return next(new HttpsError("something went wrong", 500));
  }
  const user = new User({
    name,
    email,
    password: hashPassword,
    image: req.file.path,
    places: []
  });

  try {
    await user.save();
  } catch (err) {
    return next(new HttpsError("cannot create the User", 500));
  }

  let token;

  try {
    token = jsonwebtoken.sign(
      { userid: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpsError("cannot create the User", 500));
  }

  res.status(201).json({ userId: user.id, email: user.email, token: token });
};

const loginUser = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    console.log(err);
    return next(new HttpsError("Email or password does not match", 422));
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpsError("something went wrong", 500));
  }

  // const existingUser = USERS.find(u => u.email === email);
  if (!existingUser) {
    return next(new HttpsError("email does not exists or password match", 404));
  }

  let isvalidPassword = false;
  try {
    isvalidPassword = await bycryptjs.compare(password, existingUser.password);
  } catch {
    return next(new HttpsError("something went wrong", 500));
  }
  if (!isvalidPassword) {
    return next(new HttpsError("email does not exists or password match", 404));
  }
  let token;

  try {
    token = jsonwebtoken.sign(
      { userid: existingUser.id, email: existingUser.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch {
    return next(new HttpsError("cannot create the User", 500));
  }

  res
    .status(201)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.getAllUsers = getAllUsers;
exports.getUserbyId = getUserbyId;
exports.loginUser = loginUser;
exports.signUpuser = signUpuser;

const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpsError = require("../Models/https-error");
const User = require("../Models/User");

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
  res.json({ User: Users.map(u => u.toObject()) });
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
  const user = new User({
    name,
    email,
    password,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    places: []
  });

  try {
    await user.save();
  } catch (err) {
    return next(new HttpsError("cannot create the User", 500));
  }
  res.status(201).json({ user });
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
  if (!existingUser || existingUser.password !== password) {
    return next(new HttpsError("email does not exists or password match", 404));
  }
  const user = {
    email,
    password
  };

  res.status(201).json({ user });
};

exports.getAllUsers = getAllUsers;
exports.getUserbyId = getUserbyId;
exports.loginUser = loginUser;
exports.signUpuser = signUpuser;
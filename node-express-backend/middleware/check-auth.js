const HttpError = require("../Models/https-error");
const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "super_secret_key_share_and_die";

const authToken = (req, res, next) => {
  if (req.method == "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization :{'bearer token'}
    if (!token) {
      return next(new HttpError("autorization failed", 401));
    }
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    req.userdata = { userId: decodedToken.userid };
    next();
  } catch (err) {
    return next(new HttpError("Authorization Failed", 401));
  }
};

module.exports = authToken;

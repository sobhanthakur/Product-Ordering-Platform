const jwt = require("jsonwebtoken");
const config = require("../config/config");

// A middle ware to check authorization for accessing each APIs
module.exports = (req, res, next) => {
  try {
    const bearer = req.headers.authorization.split(" ")[0];
    if (bearer !== "Bearer") {
      return res.status(400).json({
        message: "Bad Request"
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_KEY);
    req.userData = decoded;
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
  next();
};

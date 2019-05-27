const mongoose = require("mongoose");

const User = require("../../models/users");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const randtoken = require("rand-token");

const config = require("../../config/config");

// Create a new user
exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user);
      if (user.length >= 1) {
        return res.status(422).json({
          message: "User already present"
        });
      } else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });

            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

// Remove a user
exports.delete = (req, res, next) => {
  User.remove({ _id: req.params.body })
    .exec()
    .then(user => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      error: err;
    });
};

// Login user. Create a JWT token.
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Unauthorized"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            config.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          var refreshToken = randtoken.uid(256);
          User.updateOne(
            { email: req.body.email },
            {
              $set: {
                refreshToken: refreshToken
              }
            }
          )
            .exec()
            .catch();
          console.log(user);
          return res.status(200).json({
            message: "Auth successfull",
            accessToken: token,
            refreshToken: refreshToken
          });
        }
        return res.status(401).json({
          message: "Unauthorized"
        });
      });
    })
    .catch(err => {
      error: err;
    });
};

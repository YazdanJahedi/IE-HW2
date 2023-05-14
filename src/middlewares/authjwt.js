const jwt = require("jsonwebtoken");
const auth_config = require("../config/auth.config.js");
const db = require("../models");

const authjwt = {
  // verifyToken
  verifyToken: (req, res, next) => {
    let the_token = req.headers.token;
    jwt.verify(the_token, auth_config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ message: "Not authorized" });
      req.decoded = decoded;
      next();
    });
  },

  // verify student
  verify_student: (req, res, next) => {
    db.students
      .findById(req.decoded._id)
      .then((user) => {
        if (req.decoded.__t == "Students") {
          console.log("role is student");
          next();
        }
        else res.status(403).send({ message: "role is not student" });
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  },

  // verify Teacher
  verify_teacher: (req, res, next) => {
    db.teachers
    .findById(req.decoded._id)
    .then((user) => {
      if (req.decoded.__t == "Teachers") {
        console.log("role is teacher");
        next();
      }
      else res.status(403).send({ message: "role is not teacher" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
  },

  // verify Edu_manager
  verify_edu_manager: (req, res, next) => {
    db.edu_managers
    .findById(req.decoded._id)
    .then((user) => {
      if (req.decoded.__t == "Edu_manager") {
        console.log("role is edu_manager");
        next();
      }
      else res.status(403).send({ message: "role is not Edu_manager" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
  },
};

module.exports = authjwt;

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const { model } = require("mongoose");

verifyToken = (req, res, next) => {
    let token = req.session.token;
    console.log("verityToken midware");
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req._id = decoded.id;
      next();
    });
};

const authJwt = {
    verifyToken
}
  
module.exports = authJwt;
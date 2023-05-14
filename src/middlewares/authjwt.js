const jwt = require("jsonwebtoken");
const auth_config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
    console.log("VerityToken middleware");

    let user_token = req.session.token;
    jwt.verify(user_token, auth_config.secret, (err, decoded) => {
      if (err) 
        return res.status(401).send({ message: "Not authorized" });  
      req._id = decoded.id;
      next();
    });
};

const authjwt = {
    verifyToken
}
  
module.exports = authjwt;
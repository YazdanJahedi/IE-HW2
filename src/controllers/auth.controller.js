const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;
const tokenDb = db.token;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");


exports.sign_in = (req,res)=>{
    console.log("login req resiaved...")

    User.findOne({
        user_id: req.body.user_id
    }).then( 
      user => {
        if (!user) {
            return res.status(404).send({ message : "user not found" });
        }
        
        console.log("login... user_id found...")
        var passIsValid = bcrypt.compareSync(req.body.password,user.password);
        if (!passIsValid){
            return res.status(401).send( { message: "pass is incorrect" } );
        }
        console.log("login... pass is ok...")
        var ntoken = jwt.sign({id : user._id}, config.secret, {
            expiresIn : 600,
        });
        req.session.token = ntoken;
        const tokenObj = new tokenDb({
            user_id : user._id,
            token : ntoken,
            type : user.__t // type
        });
        if (tokenObj == null){
            console.log("tokenObg is null")
            res.status(400).send({
                message : "an error accured adding token to db"
            })
        }else{
            tokenObj.save().then(()=>{
                console.log("login... save tokenObj")
                res.status(200).send({
                    id : user._id,
                    user_id : user.user_id,
                    email : user.email,
                    type : user.__t  // type
                });
            }).catch(
                (err) => {
                    res.status(500).send({ message: err || "token is not saved" }); 
                }
            )
        }
    }).catch((err)=>{
        res.status(500).send({ message: err || "user not found" });
        return;
    });
}
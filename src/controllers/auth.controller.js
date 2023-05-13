const auth_config = require("../config/auth.config.js");
const db = require("../models");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");


exports.login = (req,res)=>{
    console.log("login request...")

    db.users.findOne(
        {
            user_id: req.body.user_id
        }
    )
    .then(user => {
        if (!user) 
            return res.status(404).send( { message : "fail: user not found" } );
        
        // check if password is valid or not
        if (!bcrypt.compareSync(req.body.password, user.password))
            return res.status(401).send( { message: "fail: Password is not true" } );
        
        const the_token = jwt.sign({id: user._id}, auth_config.secret, {expiresIn: 600});
        
        const new_token = new db.token({
            user_id : user._id,
            token : the_token,
            type : user.__t  // type
        });

        req.session.token = the_token;

        new_token.save()
        .then(() => {
            res.status(200).send({
                id : user._id,
                user_id : user.user_id,
                type : user.__t 
            });
        })
        .catch((err) => {
                res.status(500).send({ message: "fail: token is not saved" || err}); 
            }
        )
    })
    .catch((err) => {
        res.status(500).send({ message: "fail: user not found" || err});
    });
}
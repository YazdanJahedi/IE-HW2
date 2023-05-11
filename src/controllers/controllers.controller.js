const db = require("../models");
const schemas = db.schemas;
var bcrypt = require("bcrypt");

function selType(user){
    switch (user)
    {
        case "Student" :
            return db.students;
        case "Professor" :
            return db.teachers;
        case "EducationManager" :
            return db.edu_managers;
    }
}


exports.createUser = function createUser(user){
    return  (req, res) => {
        console.log(req.body);
        let obj = null;
        const hashed_password = bcrypt.hashSync(req.body.password, 8);
        switch(user){
            case "Student" :
                obj = new db.students({
                    firstname : req.body.firstname,
                    lastname: req.body.lastname,
                    user_id : req.body.user_id,
                    password : hashed_password,
                    email : req.body.email,
                    phone_number: req.body.phone_numer,
                    // --------------------
                    grade: req.body.grade,
                    entry_year : req.body.entry_year,
                    entry_semister : req.body.entry_semister,
                    GPA : req.body.GPA,
                    faculty : req.body.faculty,
                    study_field : req.body.study_field,
                });
                break;

            case "Professor" :
                obj = new db.teachers({
                    firstname : req.body.firstname,
                    lastname: req.body.lastname,
                    user_id : req.body.user_id,
                    password : hashed_password,
                    email : req.body.email,
                    phone_number: req.body.phone_numer,
                    // --------------------
                    faculty : req.body.faculty,
                    field : req.body.field,
                    rank : req.body.rank,
                });
                break;

            case "EducationManager" :
                obj = new db.edu_managers({
                    firstname : req.body.firstname,
                    lastname: req.body.lastname,
                    user_id : req.body.user_id,
                    password : hashed_password,
                    email : req.body.email,
                    phone_number: req.body.phone_numer,
                    // --------------------
                    faculty : req.body.faculty
                });
                break;

        }
        if (obj == null){
            res.status(400).send({
                message : "can only add student professor and em"
            })
        } else {
            obj.save().then(()=>{
                res.send(obj);
            }).catch(err=>{
                res.status(500).send({
                    message : err.message
                });
            });
        }
    }
}

exports.deleteUser = function deleteUser(user){
    return (req,res) => {
        const id = req.params.id;
        const obj = selType(user);
        obj.findByIdAndRemove(id).then(data => {
            if (!data)
            {
                res.status(404).send({
                    message :"user not found"
                });
            }
            else{
                res.status(200).send({
                    message : "user deleted successfully"
                });
            }
        }).catch(err => {
            res.status(500).send(
                {
                    message:"can't delete user"
                }
            );
        });
    }
}

// has bug!! 
exports.findAllUsers =  function findAllUsers(user) {
    const obj = selType(user);
    return  (req,res) => {
        obj.find({type : user}).then(data=>{
            if (!data) {
                res.status(500).send(
                    { message : "list is empty" }
                )
            } else {
                console.log(data)
                res.send(data);
            }
        }).catch(err=>{
            res.status(500).send(
                { message : err.message }
            );
        });
    }
}

exports.findUser = function(user){
    const obj = selType(user);
    return (req,res)=>{
        const id = req.params.id;
        obj.findById(id).then(data=>{
            res.status(200).send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user."
            });
        });
    }
}



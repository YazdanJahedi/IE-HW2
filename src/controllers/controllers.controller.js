const db = require("../models");
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


exports.admin_create_user = (user) => {
    return (req, res) => {
        let obj;
        switch(user){
            case "Student" :
                obj = new db.students({
                    firstname : req.body.firstname,
                    lastname: req.body.lastname,
                    user_id : req.body.user_id,
                    password : bcrypt.hashSync(req.body.password, 8),
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
                    password : bcrypt.hashSync(req.body.password, 8),
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
                    password : bcrypt.hashSync(req.body.password, 8),
                    email : req.body.email,
                    phone_number: req.body.phone_numer,
                    // --------------------
                    faculty : req.body.faculty
                });
                break;

        }

            obj.save().then(()=>{
                res.send(obj);
            }).catch(err=>{
                res.status(500).send({
                    message : err.message
                });
            });
        
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
        obj.find({__t: "Students"}).then(data=>{
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

exports.createCourse = (req,res)=> {
    console.log("create course... user token : "+ req.session.token);
    db.token.findOne({
        token : req.session.token
    }).then((ftoken)=>{
        console.log("create course... user is found");
        if (ftoken.type == "Edu_mangager"){
            const obj = new db.basic_lesssons({
                course_name : req.body.course_name,
                pre_requisites : req.body.pre_requisites,
                co_requisite : req.body.co_requisite,
                units : req.body.units
            }).save().then(()=>{
                res.send(obj);
            }).catch((err)=>{
                res.status(500).send({
                    message : err.message
                })
            })
        } else{
            res.status(401).send({
                message : "you cant create course"
            });
        }
    });
}

exports.deleteCourse = (req,res)=>{
    db.token.findOne({
        token : req.session.token
    }).then((ftoken)=>{
        if (ftoken.type == "Edu_mangager") {
            const id = req.params.id;
            db.basic_lesssons.findByIdAndRemove(id).then(data => {
                if (!data) {
                    res.status(404).send({
                        message :"course not found"
                    });
                } else {
                    res.status(200).send({
                        message : "course deleted successfully"
                    });
                }
            }).catch(err => {
                res.status(500).send(
                    { message:"cant delete course" }
                );
            });
        }else{
            res.status(401).send({
                message : "you cant delete course"
            });
        }
    });
}

// todo
exports.manGetCourses = (req,res)=>{
    db.token.findOne({
        token : req.session.token
    }).then((ftoken)=>{
        if (ftoken.type == "Edu_mangager") {
            db.basic_lesssons.find().then(data => {
                if (!data) {
                    res.status(404).send({
                        message : "courses not found"
                    });
                } else {
                    res.status(200).send({data});
                }
            }).catch(err => {
                res.status(500).send(
                    { message:"cant show " }
                );
            });
        } else if (ftoken.type == "Student" || ftoken.type == "Professor") {
            const id = ftoken.user_id;
            const obj = selType(ftoken.type); // todo: sync names
            obj.findById(id).select('courses').then(data=>{ // check
                res.status(200).send({
                    data
                });
            });
        }else{
            res.status(401).send({
                message : "you cant see courses list"
            });
        }
    });
}

// todo
exports.manGetCoursesId = (req,res)=>{
    schemas.token.findOne({
        token : req.session.token
    }).then((ftoken)=>{
        if (ftoken.type == "Edu_mangager") {
            const id = req.params.id;
            schemas.course.findById(id).then(data => {
                if (!data) {
                    res.status(404).send({
                        message :"course not found"
                    });
                }
                else{
                    res.status(200).send({data});
                }
            }).catch(err => {
                res.status(500).send(
                    { message:"cant show " }
                );
            });
        }else if (ftoken.type == "Student" || ftoken.type == "Professor"){
            const id = ftoken.user_id;
            const course_id = req.params.id;
            const obj = selType(ftoken.type); // todo: sync names
            obj.findById(id).select('courses').then(data=>{
                const found = data.find(element => element = course_id);
                if (!found){
                    res.status(404).send(
                        { message : "this user does not have this course" }
                    )
                }else{
                    res.status(200).send(found)
                }
            });
        } else{
            res.status(401).send({
                message : "you cant see this course"
            });
        }
    });
}

// has bug
exports.manGetUsers = function(user){

    return (req,res)=>{
        db.token.findOne({
            token : req.session.token
        }).then((ftoken)=>{
            if (ftoken.type == "Edu_mangager") {
                const obj = selType(user);
                obj.find({type : user}).then(data => {
                    if (!data) {
                        res.status(404).send(
                            { message : user +"s not found"}
                        );
                    }
                    else{
                        res.status(200).send({data});
                    }
                }).catch(err => {
                    res.status(500).send(
                        { message:"cant show " }
                    );
                });
            }else{
                res.status(401).send({
                    message : "you cant see " + user + " list"
                });
            }
        });
    }
}

// has bug
exports.manGetUsersId = function(user){

    return (req,res)=>{
        db.token.findOne({
            token : req.session.token
        }).then((ftoken)=>{
            if (ftoken.type == "EducationManager")
            {
                const obj = selType(user);
                const id = req.params.id;
                obj.findById(id).then(data => {
                    if (!data) {
                        res.status(404).send({
                            message : user +" not found"
                        });
                    }
                    else{
                        res.status(200).send({data});
                    }
                }).catch(err => {
                    res.status(500).send(
                        { message:"cant show " }
                    );
                });
            }else{
                res.status(401).send({
                    message : "you cant see this" + user
                });
            }
        });
    }
}

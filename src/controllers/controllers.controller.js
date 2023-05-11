const db = require("../models");
const schemas = db.schemas;

exports.createUser = function createUser(user){
    return  (req, res) => {
        console.log(req.body);
        let obj = null;
        // const pass = bcrypt.hashSync(req.body.user_password,8);
        switch(user){
            case "Student" :
                obj = new db.students({
                    firstname : req.body.firstname,
                    lastname: req.body.lastname,
                    user_id : req.body.user_id,
                    password : req.body.password, // todo: check diff
                    email : req.body.email,
                    phone_number: req.body.phone_numer,
                    // --------------------
                    grade: req.body.grade,
                    entry_year : req.body.entry_year,
                    entry_semister : req.body.entry_semister,
                    GPA : req.body.GPA,
                    faculty : req.body.faculty,
                    study_field : req.body.study_field
                });
                break;
/*
            case "Professor" :
                obj = new schemas.professor({
                    user_name : req.body.user_name,
                    _id : req.body._id,
                    user_password : pass,
                    user_email : req.body.user_email,
                    user_phone : req.body.user_phone,
                    prf_dpt : req.body.prf_dpt,
                    prf_major : req.body.prf_major,
                    prf_level : req.body.prf_level
                });
                break;

            case "EducationManager" :
                obj = new schemas.educationManager({
                    user_name : req.body.user_name,
                    _id : req.body._id,
                    user_password : pass,
                    user_email : req.body.user_email,
                    user_phone : req.body.user_phone,
                    em_dept : req.body.em_dept
                });
                break;
*/
        }
        if (obj == null)
            res.status(400).send({
                message : "can only add student professor and em"
            })
        else
        {
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
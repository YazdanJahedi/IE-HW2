const { model, modelNames } = require("mongoose");
const db = require("../models");
const hash = require("bcrypt");
const auth_config = require("../config/auth.config.js");
var jwt = require("jsonwebtoken");

let roles = ["Students", "Teachers", "Edu_manager"];
function get_db_model_by_role(model_name) {
  if (model_name == roles[0]) return db.students;
  else if (model_name == roles[1]) return db.teachers;
  else if (model_name == roles[2]) return db.edu_managers;
  else return null;
}

exports.login = (req, res) => {
  db.users
    .findOne({ user_id: req.body.user_id })
    .then((user) => {
      if (!user)
        return res.status(404).send({ message: "fail: user not found" });

      // check if password is valid or not
      if (!hash.compareSync(req.body.password, user.password))
        return res.status(401).send({ message: "fail: Password is not true" });

      const the_token = jwt.sign(
        { id: user._id, __t: user.__t },
        auth_config.secret,
        { expiresIn: 86400 }
      );

      res.send({
        id: user._id,
        user_id: user.user_id,
        role: user.__t,
        accessToken: the_token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.admin_create_user = (model_name) => {
  return (req, res) => {
    let new_instance;
    if (model_name == roles[0]) {
      new_instance = new db.students({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        user_id: req.body.user_id,
        password: hash.hashSync(req.body.password, 8),
        email: req.body.email,
        phone_number: req.body.phone_numer,
        // --------------------
        grade: req.body.grade,
        entry_year: req.body.entry_year,
        entry_semister: req.body.entry_semister,
        GPA: req.body.GPA,
        faculty: req.body.faculty,
        study_field: req.body.study_field,
        courses: req.body.courses,
      });
    } else if (model_name == roles[1]) {
      new_instance = new db.teachers({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        user_id: req.body.user_id,
        password: hash.hashSync(req.body.password, 8),
        email: req.body.email,
        phone_number: req.body.phone_numer,
        // --------------------
        faculty: req.body.faculty,
        field: req.body.field,
        rank: req.body.rank,
        courses: req.body.courses,
      });
    } else if (model_name == roles[2]) {
      new_instance = new db.edu_managers({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        user_id: req.body.user_id,
        password: hash.hashSync(req.body.password, 8),
        email: req.body.email,
        phone_number: req.body.phone_numer,
        // --------------------
        faculty: req.body.faculty,
      });
    }

    new_instance
      .save()
      .then(() => {
        res.send(new_instance);
        console.log("OK: a new user is created by admin");
      })
      .catch((err) => {
        res.status(500).send({
          message: "Fail: instance can not be saved in DB",
        });
      });
  };
};

exports.admin_delete_user = (model_name) => {
  return (req, res) => {
    get_db_model_by_role(model_name)
      .findByIdAndRemove(req.params.id)
      .then((data) => {
        if (!data)
          res.status(404).send({
            message: "Fail: user not found in the database",
          });
        else
          res.send({
            message: "OK: delete one user",
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Fail: an Error happend while deleting user",
        });
      });
  };
};

exports.admin_find_all_users = (model_name) => {
  return (req, res) => {
    get_db_model_by_role(model_name)
      .find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  };
};

exports.admin_find_users_by_id = (model_name) => {
  return (req, res) => {
    get_db_model_by_role(model_name)
      .findById(req.params.id)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err,
        });
      });
  };
};

exports.admin_update_users = (model_name) => {
  return (req, res) => {
    get_db_model_by_role(model_name)
      .findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
      .then((data) => {
        console.log(data);
        res.send({ message: "OK: data is updated" });
      })
      .catch((err) => {
        res.status(500).send({
          message: err,
        });
      });
  };
};

exports.eduManager_create_course = (req, res) => {
  console.log("create course... user is found");

  const lesson_instance = new db.basic_lesssons({
    course_name: req.body.course_name,
    pre_requisites: req.body.pre_requisites,
    co_requisite: req.body.co_requisite,
    units: req.body.units,
  });

  lesson_instance
    .save()
    .then(() => {
      console.log("new lesson is added to DB");
      res.send(lesson_instance);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.eduManager_update_course = (req, res) => {
  db.basic_lesssons
    .findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then((data) => {
      res.send({ message: "OK: data is updated" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

exports.eduManager_delete_course = (req, res) => {
  const id = req.params.id;
  db.basic_lesssons
    .findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "course not found",
        });
      } else {
        res.status(200).send({
          message: "course deleted successfully",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "cant delete course" });
    });
};

exports.eduManager_find_all_users = function (model_name) {
  return (req, res) => {
    get_db_model_by_role(model_name)
      .find()
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: `${model_name} not found` });
        } else {
          res.status(200).send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  };
};

exports.eduManager_find_users_by_id = function (model_name) {
  return (req, res) => {
    get_db_model_by_role(model_name)
      .findById(req.params.id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `${model_name} not found`,
          });
        } else {
          res.status(200).send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  };
};

exports.find_all_courses = (req, res) => {
  if (req.decoded.__t == roles[2]) {
    // manager:
    console.log("/courses is for edu_man");
    db.basic_lesssons
      .find()
      .then((data) => {
        if (!data)
          res.status(404).send({
            message: "courses are not found",
          });
        else res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  } else {
    // studnt or teacher
    console.log(`/courses is for ${req.decoded.__t}`);
    get_db_model_by_role(req.decoded.__t)
      .findById(req.decoded.id)
      .then((data) => {
        res.status(200).send(data.courses);
      })
      .catch((err) => {
        res.status(500).send({
          message: err,
        });
      });
  }
};

exports.find_courses_by_id = (req, res) => {
  if (req.decoded.__t == roles[2]) {
    // edu manager
    db.basic_lesssons
      .findById(req.params.id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: "courses are not found",
          });
        } else {
          res.status(200).send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  } else {
    // student or teacher
    // todo
    get_db_model_by_role(req.decoded.__t)
      .findById(req.decoded.id)
      .then((data) => {
        res.status(200).send(data.courses);
      })
      .catch((err) => {
        res.status(500).send({
          message: err,
        });
      });
  }
};

exports.student_update_student = (req, res) => {
  if (req.params.id != req.decoded.id)
    return res.status(403).send({
      message: `you entered someone else id yours is ${req.decoded.id}`,
    });

  db.students
    .findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then((data) => {
      res.send({ message: "OK: data is updated" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

exports.teacher_update_teacher = (req, res) => {
  if (req.params.id != req.decoded.id)
    return res.status(403).send({
      message: `you entered someone else id yours is ${req.decoded.id}`,
    });

  db.teachers
    .findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then((data) => {
      res.send({ message: "OK: data is updated" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

// todo
exports.manGetCoursesId = (req, res) => {
  schemas.token
    .findOne({
      token: req.session.token,
    })
    .then((ftoken) => {
      if (ftoken.type == "Edu_mangager") {
        const id = req.params.id;
        schemas.course
          .findById(id)
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: "course not found",
              });
            } else {
              res.status(200).send({ data });
            }
          })
          .catch((err) => {
            res.status(500).send({ message: "cant show " });
          });
      } else if (ftoken.type == "Student" || ftoken.type == "Professor") {
        const id = ftoken.user_id;
        const course_id = req.params.id;
        const obj = get_db_model_by_role(ftoken.type); // todo: sync names
        obj
          .findById(id)
          .select("courses")
          .then((data) => {
            const found = data.find((element) => (element = course_id));
            if (!found) {
              res
                .status(404)
                .send({ message: "this user does not have this course" });
            } else {
              res.status(200).send(found);
            }
          });
      } else {
        res.status(401).send({
          message: "you cant see this course",
        });
      }
    });
};

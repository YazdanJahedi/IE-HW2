const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

let all_models = require("./schemas.model.js")(mongoose);

db.users = all_models.users;
db.students = all_models.students;
db.teachers = all_models.teachers;
db.edu_managers = all_models.eduManagers;
db.it_manager = all_models.ITManager;
db.basic_lesssons = all_models.basicLessons;
db.termic_lessons = all_models.termicLessons;

module.exports = db;
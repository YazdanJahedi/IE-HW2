const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require("./users.model.js")(mongoose);
db.students = require("./students.model.js");
db.teachers = require("./teachers.model.js");
db.edu_managers = require("./edu_manager.model.js");
db.basic_lesssons = require("./basic_lessons.model.js");
db.termic_lessons = require("./termic_lessons.model.js");


module.exports = db;
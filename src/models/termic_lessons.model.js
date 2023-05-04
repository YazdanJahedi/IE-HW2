const Basic_lessons = require("./users.model.js");

module.exports = mongoose => {
    const Termic = Basic_lessons.discriminator('Termic_lessons', 
        new mongoose.Schema({
            class_date: Date,
            class_time: String,
            exam_date: Date,
            exam_time: String,
            exam_loc: String,
            teacher_name: String,
            capasity: Number,
            semister: Number,
        })
    );
    return Termic;
};
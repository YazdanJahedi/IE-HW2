module.exports = mongoose => {
    const Users = require("./users.model.js")(mongoose);

    const Students = Users.discriminator('Students', 
        new mongoose.Schema({
            grade: String, 
            entry_year: Number,
            entry_semister: Number,
            GPA: Number,
            faculty: String,
            field: String
        })
    );
    return Students;
};
const Users = require("./users.model");

module.exports = mongoose => {
    const Students = Users.discriminator('Students', 
        new mongoose.Schema({
            grade: String, 
            entry_year: Number,
            entry_semister: Number,
            GPA: Number,
            faculty: String
        })
    );
    return Students;
  };

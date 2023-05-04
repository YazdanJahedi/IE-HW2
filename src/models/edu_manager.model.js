const Users = require("./users.model.js");

module.exports = mongoose => {
    const Edu_man = Users.discriminator('Edu_mangager', 
        new mongoose.Schema({
            faculty: String,
        })
    );
    return Edu_man;
};
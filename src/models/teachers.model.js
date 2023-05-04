const Users = require("./users.model.js");

module.exports = mongoose => {
    const Teachers = Users.discriminator('Teachers', 
        new mongoose.Schema({
            faculty: String,
            field: String,
            rank: String,
        })
    );
    return Teachers;
};
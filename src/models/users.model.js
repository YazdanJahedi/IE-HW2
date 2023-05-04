module.exports = mongoose => { 
    const user_discrimintor = {
      discriminatorKey: "type",
      collection: "Users"
    }

    var schema = new mongoose.Schema(
      {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        user_id: { type: String, required: true },
        password: { type: String, required: true }, 
        email: String, 
        phone_number: Number,
      },
      user_discrimintor
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Users = mongoose.model("Users", schema);
    return Users;
  };
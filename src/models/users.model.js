module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        user_id: { type: String, required: true },
        password: { type: String, required: true }, 
        email: String, 
        phone_number: Number,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Users = mongoose.model("Users", schema);
    return Users;
  };
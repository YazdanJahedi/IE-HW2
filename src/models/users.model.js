module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        firstname: String,
        lastname: String,
        user_id: String,
        password: String, 
        email: String, 
        phone_number: Number,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });2
  
    const Tutorial = mongoose.model("users", schema);
    return Tutorial;
  };
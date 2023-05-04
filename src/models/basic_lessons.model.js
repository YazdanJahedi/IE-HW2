module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: { type: String, required: true },
        prerequisites: String,
        corequisite: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const lessons = mongoose.model("Basic_lessons", schema);
    return lessons;
  };
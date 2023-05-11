module.exports = mongoose => { 
    let schema1 = new mongoose.Schema(
      {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        user_id: { type: String, required: true },
        password: { type: String, required: true }, 
        email: String, 
        phone_number: String,
      },
      { timestamps: true }
    );
  
    schema1.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Users_model = mongoose.model("Users", schema1);

    // ----------------------------------------------

    const Students_model = Users_model.discriminator('Students', 
        new mongoose.Schema({
            grade: String, 
            entry_year: Number,
            entry_semister: Number,
            GPA: Number,
            faculty: String,
            study_field: String,
            courses: [String],
        })
    );

    // ----------------------------------------------

    const Teachers_model = Users_model.discriminator('Teachers', 
        new mongoose.Schema({
            faculty: String,
            field: String,
            rank: String,
            courses: [String],
        })
    );

    // ----------------------------------------------

    const Edu_man_model = Users_model.discriminator('Edu_mangager', 
        new mongoose.Schema({
            faculty: String,
        })
    );

    // ----------------------------------------------

    let schema2 = mongoose.Schema(
        {
          course_name: { type: String, required: true },
          pre_requisites: [String],
          co_requisite: [String],
          units: Number,
        },
        { timestamps: true }
      );
    
      schema2.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
    
    const Lessons_model = mongoose.model("Basic_lessons", schema2);

    // ----------------------------------------------

    const Termic_model = Lessons_model.discriminator('Termic_lessons', 
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

    // ----------------------------------------------

    const IT_man_model = Users_model.discriminator('IT_mangager', mongoose.Schema({}))

    // ----------------------------------------------

    let token_schema = new mongoose.Schema(
      {
          user_id : String,
          token : String,
          type : String
      }
    );

    token_schema.index( { "expireAt": 1 }, { expireAfterSeconds: 600 } );
    const Token_model = new mongoose.model("Token",token_schema);

    // ----------------------------------------------

    return {
        users: Users_model,
        students: Students_model,
        teachers: Teachers_model,
        eduManagers: Edu_man_model,
        ITManager: IT_man_model,
        basicLessons: Lessons_model,
        termicLessons: Termic_model,
        token: Token_model,
    };
  };
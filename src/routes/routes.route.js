module.exports = app =>{
    const controllers = require("../controllers/controllers.controller.js");

    
    var route = require('express').Router();
   
    // admin:  create  student
    route.post('/admin/student', controllers.createUser("Student"));
    // admin:  create  prof
    route.post('/admin/professor', controllers.createUser("Professor"));
    // admin:  create  edu manager
    route.post('/admin/manager', controllers.createUser("EducationManager"));

    // admin:  delete  student/prof/edu_man
    route.delete('/admin/student/:id',controllers.deleteUser("Student"));
    route.delete('/admin/professor/:id',controllers.deleteUser("Professor"));
    route.delete('/admin/manager/:id',controllers.deleteUser("EducationManager"));
    
    app.use('/api', route);
}
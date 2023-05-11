module.exports = app =>{
    const controllers = require("../controllers/controllers.controller.js");

    
    var route = require('express').Router();
   
    // admin:  create  student/prof/edu_manager
    route.post('/admin/student', controllers.createUser("Student"));
    route.post('/admin/professor', controllers.createUser("Professor"));
    route.post('/admin/manager', controllers.createUser("EducationManager"));

    // admin:  delete  student/prof/edu_manager
    route.delete('/admin/student/:id',controllers.deleteUser("Student"));
    route.delete('/admin/professor/:id',controllers.deleteUser("Professor"));
    route.delete('/admin/manager/:id',controllers.deleteUser("EducationManager"));
    
    // admin:  find_all   student/prof/edu_manager
    route.get('/admin/students', controllers.findAllUsers("Student"));
    route.get('/admin/professors', controllers.findAllUsers("Professor"));
    route.get('/admin/managers', controllers.findAllUsers("EducationManager"));


    
    app.use('/api', route);
}
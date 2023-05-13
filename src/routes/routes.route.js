module.exports = app =>{
    const controllers = require("../controllers/controllers.controller.js");
    var route = require('express').Router();
    const auth = require("../controllers/auth.controller.js");
    const {authJwt} = require("../middlewares");

   
    // users login
    route.post('/login', auth.sign_in);

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

    // admin:  find_by_ID  student/prof/edu_manager
    route.get('/admin/student/:id', controllers.findUser("Student"));
    route.get('/admin/professor/:id', controllers.findUser("Professor"));
    route.get('/admin/manager/:id', controllers.findUser("EducationManager"));

    // admin:  change  student/prof/edu_manager
    // IN progress... !!!!

    // Edu_manager: create/delete lesson
    route.post('/course', [authJwt.verifyToken], controllers.createCourse);
    route.delete('/course/:id', [authJwt.verifyToken], controllers.deleteCourse);




    app.use('/api', route);
}
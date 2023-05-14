module.exports = app =>{
    const controllers = require("../controllers/controllers.controller.js");
    var route = require('express').Router();
    const auth = require("../controllers/auth.controller.js");
    const {authJwt} = require("../middlewares");
    let roles = ["Students", "Teachers", "Edu_manager"];
   
    // users login
    route.post('/login', controllers.login);

    // admin:  create  student/prof/edu_manager
    route.post('/admin/student', controllers.admin_create_user(roles[0]));
    route.post('/admin/professor', controllers.admin_create_user(roles[1]));
    route.post('/admin/manager', controllers.admin_create_user(roles[2]));

    // admin:  delete  student/prof/edu_manager
    route.delete('/admin/student/:id', controllers.admin_delete_user(roles[0]));
    route.delete('/admin/professor/:id', controllers.admin_delete_user(roles[1]));
    route.delete('/admin/manager/:id', controllers.admin_delete_user(roles[2]));
    
    // admin:  find_all   student/prof/edu_manager
    route.get('/admin/students', controllers.admin_find_all_users(roles[0]));
    route.get('/admin/professors', controllers.admin_find_all_users(roles[1]));
    route.get('/admin/managers', controllers.admin_find_all_users(roles[2]));

    // admin:  find_by_ID  student/prof/edu_manager
    route.get('/admin/student/:id', controllers.admin_find_users_by_id(roles[0]));
    route.get('/admin/professor/:id', controllers.admin_find_users_by_id(roles[1]));
    route.get('/admin/manager/:id', controllers.admin_find_users_by_id(roles[2]));

    // admin:  change  student/prof/edu_manager
    route.put('/admin/student/:id', controllers.admin_update_users(roles[0]));
    route.put('/admin/professor/:id', controllers.admin_update_users(roles[1]));
    route.put('/admin/manager/:id', controllers.admin_update_users(roles[2]));

    // Edu_manager: create/delete lesson
    route.post('/course', [authJwt.verifyToken], controllers.createCourse);
    route.delete('/course/:id', [authJwt.verifyToken], controllers.deleteCourse);

    // Edu_manager/Student/Teachers: find_all/find_by_id lessons
    route.get('/course/:id',[authJwt.verifyToken], controllers.manGetCoursesId);
    route.get('/courses',[authJwt.verifyToken], controllers.manGetCourses);

    // Edu_manager: find_all/find_by_id  Students/Teachers
    route.get('/students',[authJwt.verifyToken], controllers.manGetUsers(roles[0]));
    route.get('/student/:id',[authJwt.verifyToken], controllers.manGetUsersId(roles[0]));
    route.get('/professors',[authJwt.verifyToken], controllers.manGetUsers(roles[1]));
    route.get('/professor/:id',[authJwt.verifyToken], controllers.manGetUsersId(roles[1]));


    app.use('/', route);
}
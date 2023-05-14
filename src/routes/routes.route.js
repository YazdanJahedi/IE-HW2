module.exports = app =>{
    const controllers = require("../controllers/controllers.controller.js");
    var route = require('express').Router();
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

    // Edu_manager: create/update/delete lesson
    route.post('/course', [authJwt.verifyToken, authJwt.verify_edu_manager], controllers.eduManager_create_course);
    route.put('/course/:id', [authJwt.verifyToken, authJwt.verify_edu_manager], controllers.eduManager_update_course);
    route.delete('/course/:id', [authJwt.verifyToken, authJwt.verify_edu_manager], controllers.eduManager_delete_course);

    // Edu_manager: find_all/find_by_id  Students/Teachers
    route.get('/students',[authJwt.verifyToken, authJwt.verify_edu_manager], controllers.eduManager_find_all_users(roles[0]));
    route.get('/student/:id',[authJwt.verifyToken, authJwt.verify_edu_manager], controllers.eduManager_find_users_by_id(roles[0]));
    route.get('/professors',[authJwt.verifyToken, authJwt.verify_edu_manager], controllers.eduManager_find_all_users(roles[1]));
    route.get('/professor/:id',[authJwt.verifyToken, authJwt.verify_edu_manager], controllers.eduManager_find_users_by_id(roles[1]));

    // Student update student
    route.put('/student/:id', [authJwt.verifyToken, authJwt.verify_student], controllers.student_update_student);

    // Teacher update Teacher
    route.put('/professor/:id', [authJwt.verifyToken, authJwt.verify_teacher], controllers.teacher_update_teacher);

    // Edu_manager-Student-Teacher  find_all/find_by_id  lessons
    route.get('/courses', [authJwt.verifyToken], controllers.find_all_courses);
    route.get('/course/:id', [authJwt.verifyToken], controllers.find_courses_by_id);


    app.use('/', route);
}
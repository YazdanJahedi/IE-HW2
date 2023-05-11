module.exports = app =>{
    const controllers = require("../controllers/controllers.controller.js");

    
    var route = require('express').Router();
   
    route.post('/admin/student', controllers.createUser("Student"));

    app.use('/api', route);
}
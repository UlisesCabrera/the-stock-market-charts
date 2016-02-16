var express = require('express');
var router = express.Router();

module.exports = function(io) {
    // passing the io object to the controller
    var indexCtrl = require("../controllers/indexController.js")(io);
    
    /* GET home page. */
    router.get('/', indexCtrl.serveHome);
    
    
    return router;
};
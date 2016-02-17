// npm module to read .env variables
require('dotenv').load();

module.exports =  function(io) {
    var controller = {};
    
    controller.serveHome = function(req, res, next) {
        //start listen with socket.io
        io.on('connection', function(socket){
            socket.emit('hello', { message: 'Web Socket Connection Active'});
        });
        
        res.render('index', { title: 'Stock Market Tracker', baseURL: process.env.BASEURL});
    };
    
    return controller;
};
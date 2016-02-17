// npm module to read .env variables
require('dotenv').load();

module.exports =  function(io) {
    var controller = {};
    
    controller.serveHome = function(req, res, next) {
        //start listen with socket.io
        io.on('connection', function(socket){
            console.log('a user connected');
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });                
        });
        
        
        res.render('index', { title: 'Express', baseURL: process.env.BASEURL});
    };
    
    return controller;
};
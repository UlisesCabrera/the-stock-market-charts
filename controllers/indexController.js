// npm module to read .env variables
require('dotenv').load();
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");

module.exports =  function(io) {
    var controller = {};
    
    controller.serveHome = function(req, res, next) {
        
        //starts listen for connections
        io.on('connection', function(socket){
            // Step1: connect to mongo.
            MongoClient.connect(process.env.MONGOURI, function(err, db){
                if (err) {
                    console.error(err);
                //is connected to the database
                } else {
                    // Step2: send new user stocks collection
                    var stocksCollection = db.collection('stocks');
                    stocksCollection.find().toArray(function(err, allStocks){
                        assert.equal(err, null);
                        socket.emit('initialStocks', { message: 'Web Socket Connection Active', data: allStocks});
                        db.close();
                    });                
                    
                }
            });
        });
        
        res.render('index', { title: 'Stock Market Tracker', baseURL: process.env.BASEURL});
    };
    
    return controller;
};
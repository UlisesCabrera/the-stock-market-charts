// npm module to read .env variables
require('dotenv').load();
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");

module.exports =  function(io) {
    var controller = {};
    
    controller.serveHome = function(req, res, next) {
        res.render('index', { title: 'Stock Watcher', baseURL: process.env.BASEURL});
    };
    
    return controller;
};
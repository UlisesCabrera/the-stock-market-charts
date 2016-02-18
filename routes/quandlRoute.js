var express = require('express');
var router = express.Router();

module.exports = function(io) {
    // passing the io object to the controller
    var quandlCtrl = require("../controllers/quandlController.js")(io);
    
    router.get('/:stock', quandlCtrl.newStockData);
    
    router.delete('/:stockId', quandlCtrl.deleteStock);
    
    router.put('/:stockId', quandlCtrl.updateStock);
    
    return router;
};
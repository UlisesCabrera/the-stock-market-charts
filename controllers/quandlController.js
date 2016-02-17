require('dotenv').load();
var Quandl = require("quandl");

var quandl = new Quandl({
    auth_token: process.env.QUANDL_API_KEY
});

module.exports =  function(io) { 
    var quandlController = {};
    
    quandlController.stocksData = function(req, res, next){
        var query =  {
            source: 'WIKI',
            table: req.params.stock
        };
        
        var params = {
          order: "asc",
          exclude_column_names: true,
          // Notice the YYYY-MM-DD format
          start_date: "2015-01-30",
          end_date: "2016-01-29",
          column_index: 4,
          format: 'json'
        };
        
        quandl.dataset(query, params, function(err, response){
            if(err) {
                console.log(err);
                res.send({status:'failure',data: null});
            } else {
                if (response) {
                    res.send({status:'success', data: response});
                } else {
                    res.send({status:'failure',data: null});                    
                }
            }
        });        
    };
    
    return quandlController;

};

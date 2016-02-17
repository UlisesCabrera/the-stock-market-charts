require('dotenv').load();
var Quandl = require("quandl");
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");

var quandl = new Quandl({
    auth_token: process.env.QUANDL_API_KEY
});

module.exports =  function(io) {
    var quandlController = {};
    
    quandlController.stocksData = function(req, res, next) {
        
        var query =  {
            source: 'WIKI',
            table: req.params.stock // the stock code comes from the client via the params object
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
        
        // make call to Quandl API
        quandl.dataset(query, params, function(err, response){
            assert.equal(err, null);
                // if there is a response from the API, do the following:
                if (response) {
                    
                    // Step1: connect to mongo.
                    MongoClient.connect(process.env.MONGOURI, function(err, db){
                        if (err) {
                            console.error(err);
                        //is connected to the database
                        } else {
                            // Step2: create or access the collection stocks.
                            var stocksCollection = db.collection('stocks');
                            
                            // Step3: parse response from the api
                            var dataset = JSON.parse(response).dataset;

                            // Step:4 check if the stock is already on the database
                            stocksCollection.find({_id: dataset.id}).toArray(function(err, stocks){
                                assert.equal(err, null);
                                // if it is, do nothing and send a notification to the user
                                if (stocks.length > 0){
                                   res.send({status:'Already on the database'});
                                   db.close();
                                // else insert new stock to the collection and send the new stocks collection to the user   
                                } else {
                                    //setting mongo id to the data set id
                                    dataset._id = dataset.id;
                                    
                                    // insert new document
                                    stocksCollection.insert(dataset, function(err){
                                        assert.equal(err, null);
                                        
                                        // then send updated collection back to the client via io socket
                                        stocksCollection.find().toArray(function(err, allStocks){
                                            assert.equal(err, null);
                                            
                                            res.send({status:'saved to the db'});
                                            io.emit('stocksUpdated', {data: allStocks});
                                            db.close();
                                        });
                                    });                                    
                                }
                            });
                        }
                        
                    });
                } else {
                    // if the response from the API was null, send status to client
                    res.send({status:'No response from Quandl API',data: null});                    
                }
        }); 
    };
    
    return quandlController;    
};
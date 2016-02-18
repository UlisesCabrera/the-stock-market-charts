require('dotenv').load();
var Quandl = require("quandl");
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");

var quandl = new Quandl({
    auth_token: process.env.QUANDL_API_KEY
});

module.exports =  function(io) {
    var quandlController = {};
    
    quandlController.newStockData = function(req, res, next) {
        
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
                                   res.send({message:'new stock added to the db', status:'NO'});
                                   db.close();
                                // else insert new stock to the collection and send the new stocks collection to the user   
                                } else {
                                    //setting mongo id to the data set id
                                    dataset._id = dataset.id;
                                    
                                    // insert new document
                                    stocksCollection.insert(dataset, function(err){
                                        assert.equal(err, null);
                                        res.send({message:'new stock added to the db', status:'OK'});
                                        io.emit('newStockAdded', {data: dataset});
                                        db.close();
                                    });                                    
                                }
                            });
                        }
                        
                    });
                } else {
                    // if the response from the API was null, send status to client
                    res.send({message:'No response from Quandl API', status:'NO', data: null});                    
                }
        }); 
    };
    
    
    quandlController.deleteStock = function(req, res, next){
         
         // need to conver to int in order to find id on collection
         var stockId = parseInt(req.params.stockId);
         
         
         MongoClient.connect(process.env.MONGOURI, function(err, db){
            if (err) {
                console.error(err);
                //is connected to the database
            } else {
                var stocksCollection = db.collection('stocks');
                
                
                stocksCollection.deleteOne({_id: stockId}, function(err, result){
                    assert.equal(err, null);
                    // only delete stocks on other client if it was ok on the db.
                    if (result.deletedCount === 1) {
                         // updates all the connected clients
                        io.emit('stockDeleted', {data: stockId});                     
                        // send response to the http request
                        res.send({message:'stock deleted from DB' , status:'OK'});
                        db.close();
                    } else {
                        res.send({message:'stock NOT deleted from DB', status:'NO'});
                        db.close();
                    }     
                });
            }
         });
    };
    
    
    return quandlController;    
};
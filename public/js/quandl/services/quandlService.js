angular.module('QuandlModule').factory('quandlFactory',['$resource','baseURL', 
    function($resource, baseURL){
    
    return $resource(baseURL+'quandl/:stock', null, {
                'update': {
                    method: 'PUT'
                }
           });  
    
}]);
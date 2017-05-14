/*jshint esversion: 6 */
angular.module('myapp')
    .factory('apiService', ['$http', '$q', 'constants', function($http, $q, constants){
        var apiService = {};
        
        apiService.getCustomers = function() {
            var deferred = $q.defer();
            $http.get(constants.CUSTOMER_LIST).then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        apiService.createCustomer = function(params) {
            var deferred = $q.defer();
            $http.post(constants.CREATE_CUSTOMER, params).then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        
        apiService.getOrDeleteCustomer = function(customerId, del) {
            var deferred = $q.defer();
            var url = del ? constants.DELETE_CUSTOMER : constants.GET_CUSTOMER;
            url += '/' + customerId;
            var promise = del ? $http.delete(url) : $http.get(url);
            promise.then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        apiService.updateCustomer = function(customerData) {
            var deferred = $q.defer();
            var url =constants.UPDATE_CUSTOMER + '/' + customerData._id;
            $http.put(url, customerData).then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        apiService.getReportData = function() {
            var deferred = $q.defer();
            var url =constants.GENERATE_REPORT;
            $http.get(url).then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        return apiService;
    }]);
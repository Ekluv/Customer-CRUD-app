/*jshint esversion: 6 */
angular.module('myapp')
    .controller('homeCtrl', ['$scope', '$rootScope', '$location', 'apiService', function($scope, $rootScope, $location, apiService) {

        function getCustomersList() {
            apiService.getCustomers().then((customers) => {
                $scope.customers = customers;
            }, (err) => {
                window.console.log(err);
            });
        }

        getCustomersList();

        $scope.deleteCustomer = (customer) => {
            apiService.getOrDeleteCustomer(customer._id, true).then((response) => {
                getCustomersList();
            }, (err) => {
                window.console.log(err);
            });
        };

    }])


    .filter('beautifyAddress', function() {

        return function(address, optional1, optional2) {

            return address.flat + ', ' + address.street + ', ' + address.state + ' -' + address.pincode;

        };

    });
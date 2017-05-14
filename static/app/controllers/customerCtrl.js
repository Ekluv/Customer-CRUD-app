/*jshint esversion: 6 */
angular.module('myapp')
    .controller('customerCtrl', ['$scope', '$state','$stateParams', 'apiService', function($scope, $state, $stateParams, apiService){
        var customerId = $stateParams.id;
        var pageType =  customerId ? 'edit': 'add';     

        function init() {
            $scope.customer = {
                addresses: []
            };
            if (pageType === 'edit') {
                getCustomerData(customerId);
            }
        }

        init();

        function getCustomerData(customerId) {
            apiService.getOrDeleteCustomer(customerId).then((customer) => {
                $scope.customer = customer;
                $scope.customer.dob = new Date(customer.dob);
            }, (err) => {
                window.console.log(err);
            });
        }

        $scope.addAddress = () => {
            window.console.log($scope.address);
            var address = JSON.parse(JSON.stringify($scope.address));
            $scope.customer.addresses.push(address);
        };

        $scope.createOrUpdateCustomer = () => {
            var data = JSON.parse(JSON.stringify($scope.customer));
            var promise = customerId ? apiService.updateCustomer(data): apiService.createCustomer(data);
            promise.then((response) => {
                console.log(response);
                $state.go('home');
            }, (err) => {
                console.log(err);
            });
        };

    }]);
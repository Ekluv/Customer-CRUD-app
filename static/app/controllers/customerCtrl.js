/*jshint esversion: 6 */
angular.module('myapp')
    .controller('customerCtrl', ['$scope', '$state', '$stateParams', 'apiService', function($scope, $state, $stateParams, apiService) {
        var customerId = $stateParams.id;
        var pageType = customerId ? 'edit' : 'add';

        function init() {
            $scope.customer = {
                addresses: []
            };
            $scope.address = {
                flat: '',
                street: '',
                state: '',
                pincode: ''
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
                window.console.log(err); // TODO: error handling
            });
        }

        function validateAddress(address) {
            var addressErrors = {};
            Object.keys(address).forEach(function(element, index) {
                if (!address[element]) {
                    addressErrors[element] = true;
                }
            });
            return addressErrors;
        }

        $scope.addAddress = () => {
            $scope.addressErrors = validateAddress($scope.address); // validate address
            if (Object.keys($scope.addressErrors).length) {
                return;
            }
            var address = JSON.parse(JSON.stringify($scope.address));
            $scope.customer.addresses.push(address);
        };

        $scope.createOrUpdateCustomer = () => {
            var data = JSON.parse(JSON.stringify($scope.customer));
            var promise = customerId ? apiService.updateCustomer(data) : apiService.createCustomer(data);
            promise.then((response) => {
                $state.go('home');
            }, (err) => {
                window.console.log(err); // TODO: error handling
            });
        };

    }]);
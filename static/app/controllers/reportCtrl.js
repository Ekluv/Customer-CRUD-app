/*jshint esversion: 6 */
angular.module('myapp')
    .controller('reportCtrl', ['$scope', '$state', 'apiService', function($scope, $state, apiService){    
        function generateReport() {
            apiService.getReportData().then((reportData) => {
                $scope.reportData = reportData;
            }, (err) => {
                window.console.log(err);
            });
        }

        generateReport();

    }]);
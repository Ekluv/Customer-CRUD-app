angular.module("app.routes", [ 'ngRoute', 'ui.router'])
    .config(['$locationProvider', '$stateProvider','$urlRouterProvider', '$routeProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $routeProvider) {
        
        $urlRouterProvider.otherwise('/');
        // console.log($locationProvider)
        
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/static/app/views/partials/home.html',
                controller: 'homeCtrl',
            })
            .state('addCustomer', {
                url: '/customer/add',
                templateUrl: '/static/app/views/partials/customers/add-customer.html',
                controller: 'customerCtrl',
            })
            .state('editCustomer', {
                url: '/customer/edit/:id',
                templateUrl: '/static/app/views/partials/customers/add-customer.html',
                controller: 'customerCtrl',
            })
            .state('generateReport', {
                url: '/report',
                templateUrl: '/static/app/views/partials/report/report-home.html',
                controller: 'reportCtrl',
            });
        // $locationProvider.html5mode(true);
    }]);
      
'use strict';
var myApp = angular.module('myApp',['ngAnimate',
    'ngRoute']);

myApp.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/', {
            templateUrl: 'html/log_in.html'
        })
        .when('/sign_in', {
            templateUrl: 'html/sign_in.html'
        })
        .when('/irc', {
            templateUrl: 'html/irc.html'
        })
        .when('/login', {
            templateUrl: 'html/log_in.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});
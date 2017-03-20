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

myApp.factory("userInfo", function() {
    return {
      "userN": uniqid(),
      "nick": uniqid(),
      "realName": uniqid(),
      "right": 0,
	  "mute": [],
	  "removeUserMute": function(user) {
		  this.mute.splice(this.mute.indexOf(user), 1);
	  },
      "setRight": function(newRight) {
        this.right = newRight;
      },
      "server": "http://crismos.fr",
      "port": 8089,
      "socket": "",
	  "filePort": "",
      "setNick": function(newUserNick) {
        this.nick = newUserNick;
      },
      "setReal": function(newUserRealName) {
        this.realName = newUserRealName;
      },
      "setUser": function(newUserUserN, newUserRealName) {
        this.userN = newUserUserN;
        this.realName = newUserRealName;
      },
      "setServer": function(newServer) {
        this.server = newServer;
      },
      "setPort": function(newPort) {
        this.port = newPort;
      },
      "connect": function() {
        this.socket = io(this.server+":"+this.port);
      },
	  "connectFile": function() {
        this.filePort = io(this.server+":8091");
      },
      "afterConnection": function() {
        this.userN = "Guest_"+this.userN;
      }
    }
});



var uniqid = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
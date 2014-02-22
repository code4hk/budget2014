'use strict';

define(
    ["angular",
        "controllers",
        "services",
        "angular-route"
    ], function(angular) {
        angular.module('budget2014', [
            'ngRoute',
            'budget2014.controllers'
            // 'ui.bootstrap'
        ]).
        config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/section1', {
                    templateUrl: 'templates/calculator1.html',
                    controller: 'section1Ctrl'
                });
                $routeProvider.otherwise({
                    redirectTo: '/section1'
                });
            }
        ]);

    });
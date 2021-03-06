'use strict';

define(
    ["angular",
        "controllers",
        "services",
        "angular-route","ui-bootstrap"
    ], function(angular) {
        angular.module('budget2014', [
            'ngRoute',
            'budget2014.controllers',
            'ui.bootstrap'
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
        ]).config(['$tooltipProvider',function(tooltipProvider) {
            // tooltipProvider.options({placement:'right'});
        }])
            .directive('taxDiff', function() {
                return {
                    restrict: 'EA',
                    scope: {
                        propKey: '@'
                    },
                    controller: ['$scope',function($scope) {
                        // $scope.diff =$parent.diff;
                        
                            $scope.abs = Math.abs;
                        $scope.diff = $scope.$parent.diff;
                        $scope.y2014 = $scope.$parent.$y2014;
                        $scope.y2013 = $scope.$parent.$y2013;
                    }],
                    template: '<span class="payMore" ng-show="diff(propKey)>0">交多</span><span  class="payLess" ng-show="diff(propKey)<=0">交少 </span>  $ {{abs(diff(propKey))| number:0}}'
                };
            })
            .directive('diff', function() {
                    return {
                        restrict: 'EA',
                        scope: {
                            propKey: '@',
                            negative: '@'
                        },
                        controller: ['$scope',function($scope) {
                            // $scope.diff = $scope.$parent.diff;

                            $scope.abs = Math.abs;
                            $scope.diff = function(propKey) {
                                return $scope.$parent.diff(propKey);
                            };
                            $scope.payClass = function(isMore) {
                                var clazz = 'payMore';
                                if ( !! $scope.negative) {
                                    if (isMore) {
                                        clazz = 'payLess';
                                    } else if (!isMore) {
                                        clazz = 'payMore';
                                    }
                                } else {
                                    if (isMore) {
                                        clazz = 'payMore';
                                    } else if (!isMore) {
                                        clazz = 'payLess';
                                    }
                                }
                                return clazz;

                            };
                            $scope.y2014 = $scope.$parent.$y2014;
                            $scope.y2013 = $scope.$parent.$y2013;
                    }],
                    template: '<span ng-class="payClass(true)" ng-show="diff(propKey)>0">多</span><span  ng-class="payClass(false)" ng-show="diff(propKey)<0">少 </span><span  ng-class="\'payLess\'" ng-show="diff(propKey)==0">一樣 </span> <span ng-show="diff(propKey)!=0"> $ {{abs(diff(propKey))| number:0}}</span>'
                };
        });

});
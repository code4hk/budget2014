'use strict';

/* Controllers */

define(
    ["angular"], function() {

// http://www.ird.gov.hk/eng/ese/st_comp_2012_13/stcfrm.htm
//test case: calculation compare with them, extract js there to calculate
        angular.module('budget2014.controllers', []).
        controller('section1Ctrl',
            function($scope) {
                $scope.show2013 = true;
                $scope.show2014 = true;


                var init = function(year) {
                     $scope[year]={};
                    var salaryTaxInfo = {};
                    salaryTaxInfo.income = 0;
                    salaryTaxInfo.outgoingExpenses = 0;
                    salaryTaxInfo.selfEduExpenses = 0;
                    salaryTaxInfo.donations = 0;
                    salaryTaxInfo.mpf = 0;

                    salaryTaxInfo.dependentChildCurrentYear=0;
                    salaryTaxInfo.dependentChildOtherYear=0;
                    salaryTaxInfo.singleParent=0;
                    
                    $scope[year].salaryTaxInfo = salaryTaxInfo;
                };

//TODO make input as ints?
                init('y2013');
                init('y2014');
                var calculate = function(year) {
                    $scope[year].sumTax = $scope[year].salaryTaxInfo.income|0+123;
                };

                $scope.$watch('y2013',function(newVal,oldVal) {
                    console.log('changed');
                    calculate('y2013');
                },true);


            }, ['$scope'])
            .controller('MyCtrl2',
                function($scope) {

                }, ['$scope']);

    });
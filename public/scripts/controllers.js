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

                var initYear = function(year) {
                    $scope[year] = {};
                };

                initYear('y2013');
                initYear('y2014');

                $scope['y2013'].cigaretteTaxFormula = 34.12;
                $scope['y2014'].cigaretteTaxFormula = 34.12;

                var init = function() {
                    var living = {};
                    living.cigaretteCount = 0;
                    living.firstCarCount = 0;

                    var salaryTaxInfo = {};
                    salaryTaxInfo.income = 0;
                    salaryTaxInfo.outgoingExpenses = 0;
                    salaryTaxInfo.selfEduExpenses = 0;
                    salaryTaxInfo.donations = 0;
                    salaryTaxInfo.mpf = 0;



                    salaryTaxInfo.dependentChildCurrentYear = 0;
                    salaryTaxInfo.dependentChildOtherYear = 0;
                    salaryTaxInfo.singleParent = 0;


                    $scope.living = living;
                    $scope.salaryTaxInfo = salaryTaxInfo;
                };

                //TODO make input as ints?


                init();
                var calculateLiving = function(year) {
                    console.log('cal living'+year);
                    $scope[year].cigaretteTax = ($scope.living.cigaretteCount|0) * $scope['y2013'].cigaretteTaxFormula;
                    // $scope[year].cigaretteTax =$scope['y2013'].cigaretteTaxFormula * $scope.living.cigaretteCount|0;
                    $scope[year].livingTax = $scope[year].cigaretteTax;
                    console.log( $scope[year].cigaretteTax);
                    //todo underscore map
                };

                var calculate = function(year) {
                    calculateLiving(year);
                    $scope[year].sumTax = $scope.salaryTaxInfo.income | 0 + 123;
                };

                $scope.$watch('living', function(newVal, oldVal) {
                    calculateLiving('y2013');
                    calculateLiving('y2014');
                }, true);


                $scope.$watch('salaryTaxInfo', function(newVal, oldVal) {
                    calculate('y2013'); //TODO
                    calculate('y2014');
                }, true);


            }, ['$scope'])
            .controller('MyCtrl2',
                function($scope) {

                }, ['$scope']);

    });
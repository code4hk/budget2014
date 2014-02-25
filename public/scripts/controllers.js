'use strict';

/* Controllers */

//TODO extract tax cal lib or service and test it

define(
    ["angular","hkTaxCal"], function(angular,calculator) {

        // http://www.ird.gov.hk/eng/ese/st_comp_2012_13/stcfrm.htm
        //test case: calculation compare with them, extract js there to calculate
        angular.module('budget2014.controllers', []).
        controller('section1Ctrl',
            function($scope) {
                $scope.show2013 = true;
                $scope.show2014 = true;

                var initYear = function(year) {
                    $scope[year] = {};
                    $scope[year]['salary']={
                        "allowancesEntitled":{},
                        "deductionsEntitled":{},
                        "tax":{}
                    }
                };

                initYear('y2013');
                initYear('y2014');

                $scope['y2013'].cigaretteFormula = 34.12;
                $scope['y2014'].cigaretteFormula = 34.12*1.2;

                $scope['y2013'].waterFormula = 1 * 12;
                $scope['y2014'].waterFormula = 1.2 * 12; //TODO

                $scope['y2013'].electricityFormula = 1 * 12;
                $scope['y2014'].electricityFormula = 1.2 * 12; //TODO

                $scope['y2013'].firstCarFormula = 0;
                $scope['y2014'].firstCarFormula = 1000;//TODO

//                 Private cars- 
 
// (a) on the first $150000 of taxable value.................................. 40% 
// (b) on the next $150000 ............................................................ 75% 
// (c) on the next $200000 ........................................................... 100% 
// (d) on the remainder ................................................................. 115% 

                

                // http://www.gov.hk/tc/residents/taxes/motortax/


                var formulas = {
                    "y2013": {
                        "water": 1,
                        "electricity": 1
                    },
                    "y2014": {
                        "water":1,
                        "electricity":1
                    }
                }


                var livingItems = ['cigarette','water','electricity','firstCar'];
                var allItems =['living','salary'];
                var allowancesItems = ["basic","married","child","bornChild","dependentSiblings","dependent60Parents","dependent60ParentsResidedWith","dependent55Parents","dependent55ParentsResidedWith","singleParent","disabledDependent"];
                var deductionsItems = ["outgoingExpenses","selfEduExpenses","donations","mpf","others"];

                var init = function() {
                    var living = {};
                    livingItems.map(function(key) {living[key+'Count']=0;});

                    var allowances={};
                    //0 as false
                    allowancesItems.map(function(key) {allowances[key+'Count']=0});
                    allowances["basicCount"]=1;


                    var deductions={};
                    deductionsItems.map(function(key) {deductions[key+'Count']=0});
                    

                    var salaryTaxInfo = {};
                    salaryTaxInfo.income = 0;
                    salaryTaxInfo.allowances=allowances;
                    salaryTaxInfo.deductions=deductions;

                    $scope.living = living;
                    $scope.salaryTaxInfo = salaryTaxInfo;
                };

                //TODO make input as ints?


                init();
                var calculateLiving = function(year) {
                    //itemCount - itemTax - itemFormula

                    livingItems.map(function(item) {
                        $scope[year][item+'Tax'] = ($scope.living[item+'Count']|0) * $scope[year][item+'Formula'];
                        console.log(item+'Tax'+$scope[year][item+'Tax']);
                    })
                    $scope[year].livingTax = livingItems.reduce(function(p,item) {return (p|0)+($scope[year][item+'Tax']|0)});
                    console.log('total'+$scope[year].livingTax);
                    //todo underscore map
                };

                var calculate = function(year) {
                    calculateLiving(year);
                    // $scope[year].sumTax = $scope.salaryTaxInfo.income | 0 + 123;
                    $scope[year].total =  allItems.reduce(function(p,item) {return (p|0)+($scope[year][item+'Tax']|0)});
                };

                //cant handle nested
                $scope.diff = function(propKey) {
                    return $scope.$eval('y2014.'+propKey) - $scope.$eval('y2013.'+propKey);
                    // return $scope['y2014'][propKey] - $scope['y2013'][propKey];
                };

                //http://www.gov.hk/tc/residents/taxes/taxfiling/taxrates/salariesrates.htm#pr
                var calculateIncomeTax = function(year) {
                    calculateDeductions(year);
                    calculateAllowances(year);
                };

                var calculateDeductions = function(year) {
                    deductionsItems.map(function(item) {
                        $scope[year]['salary']['deductionsEntitled'][item] 
                        = $scope.salaryTaxInfo['deductions'][item+'Count']*1;
                    });
                };
                var calculateAllowances = function(year) {
                    allowancesItems.map(function(item) {
                        $scope[year]['salary']['allowancesEntitled'][item]=calculator.calAllowances(year,item,$scope.salaryTaxInfo.allowances[item+'Count']);
                    });

                     $scope[year]['salary']['allowancesEntitled']['totalChild']= $scope[year]['salary']['allowancesEntitled']['bornChild']+$scope[year]['salary']['allowancesEntitled']['child'];
                   
                      $scope[year]['salary']['allowancesEntitled']['dependent55ParentsTotal']= $scope[year]['salary']['allowancesEntitled']['dependent55Parents']+$scope[year]['salary']['allowancesEntitled']['dependent55ParentsResidedWith'];
                      $scope[year]['salary']['allowancesEntitled']['dependent60ParentsTotal']= $scope[year]['salary']['allowancesEntitled']['dependent60Parents']+$scope[year]['salary']['allowancesEntitled']['dependent60ParentsResidedWith'];
                   
                    // _calculator.calAllowances
                   // $scope[year].allowancesEntitled ={};

                };

                $scope.$watch('living', function(newVal, oldVal) {
                    calculateLiving('y2013');
                    calculateLiving('y2014');
                }, true);

                $scope.$watch('salaryTaxInfo', function(newVal, oldVal) {
                    calculateIncomeTax('y2013');
                    calculateIncomeTax('y2014');
                    $scope.salaryTaxInfo['allowances']['singleParentCount'] =  $scope.salaryTaxInfo['allowances']['isSingleParent'] ==="true"?1:0;
                    // salary
                                        console.log(  $scope.salaryTaxInfo['allowances']['singleParentCount']);
                }, true);


            }, ['$scope']);
            // .controller('MyCtrl2',
            //     function($scope) {

            //     }, ['$scope']);

    });
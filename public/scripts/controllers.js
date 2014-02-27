'use strict';

/* Controllers */

//TODO extract tax cal lib or service and test it

define(
    ["angular", "hkTaxCal"], function(angular, calculator) {

        // http://www.ird.gov.hk/eng/ese/st_comp_2012_13/stcfrm.htm
        //test case: calculation compare with them, extract js there to calculate
        angular.module('budget2014.controllers', []).
        controller('section1Ctrl', ['$scope',
            function($scope) {
                $scope.show2013 = true;
                $scope.show2014 = true;

                var initYear = function(year) {
                    $scope[year] = {};
                    $scope[year]['salary'] = {
                        "allowancesEntitled": {},
                        "deductionsEntitled": {},
                        "tax": {},
                    };
                    $scope[year]['salaryTax']=0;
                };

                initYear('y2013');
                initYear('y2014');

                $scope['y2013'].cigaretteFormula = 34.12;
                $scope['y2014'].cigaretteFormula = 38.12;

                $scope['y2013'].waterFormula = 1 * 12;
                $scope['y2014'].waterFormula = 1.2 * 12; //TODO

                $scope['y2013'].electricityFormula = function(month) {
                    var afterDeduction= month*12-1800;
                        if(afterDeduction<0){
                            return 0;
                        } else {
                            return afterDeduction;
                        }
                };
                $scope['y2014'].electricityFormula = 1*12;


                $scope['y2013'].publicHouseRentFormula = 1 * 10;
                $scope['y2014'].publicHouseRentFormula = 1 * 11;

                //TODO

                $scope['y2013'].firstCarFormula = 0;
                $scope['y2014'].firstCarFormula = 1000; //TODO


 
                $scope['y2013'].publicServiceFormula = function(count) {
                    return Math.max(count - 1500, 0) * 4;
                };
                $scope['y2014'].publicServiceFormula = function(count) {
                    return Math.max(count - 1500, 0) * 2 + count * 2;
                };

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
                        "water": 1,
                        "electricity": 1
                    }
                }


                var livingItems = ['cigarette', 'water', 'electricity', 'firstCar', 'publicService','publicHouseRent'];
                var allItems = ['living', 'salary'];
                var allowancesItems = ["basic", "married", "child", "bornChild", "dependentSiblings", "dependent60Parents", "dependent60ParentsResidedWith", "dependent55Parents", "dependent55ParentsResidedWith", "singleParent", "disabledDependent"];
                var deductionsItems = ["outgoingExpenses", "selfEduExpenses", "donations", "mpf", "others"];

                var init = function() {
                    var living = {};
                    livingItems.map(function(key) {
                        living[key + 'Count'] = 0;
                    });

                    var allowances = {};
                    //0 as false
                    allowancesItems.map(function(key) {
                        allowances[key + 'Count'] = 0;
                    });
                    allowances["basicCount"] = 1;
                    //either basic or married

                    var deductions = {};
                    deductionsItems.map(function(key) {
                        deductions[key + 'Count'] = 0;
                    });


                    var salaryTaxInfo = {};
                    salaryTaxInfo.income = 0;
                    salaryTaxInfo.allowances = allowances;
                    salaryTaxInfo.deductions = deductions;
                    salaryTaxInfo.maritalStatus='single';
                    $scope.living = living;
                    $scope.salaryTaxInfo = salaryTaxInfo;
                };

                //TODO make input as ints?


                init();
                var calculateLiving = function(year) {
                    //itemCount - itemTax - itemFormula

                    livingItems.map(function(item) {

                        if (typeof($scope[year][item + 'Formula']) === 'function') {
                            $scope[year][item + 'Tax'] = $scope[year][item + 'Formula'](($scope.living[item + 'Count'] | 0));
                        } else {
                            $scope[year][item + 'Tax'] = ($scope.living[item + 'Count'] | 0) * $scope[year][item + 'Formula'];
                        }

                        console.log(item + 'Tax' + $scope[year][item + 'Tax']);
                    })

                    $scope[year].livingTax = livingItems.reduce(function(p, item) {
                        return (p | 0) + ($scope[year][item + 'Tax'] | 0)
                    });

                    console.log('livingTotal' + $scope[year].livingTax);


                    //todo underscore map
                };

                var calculateTotal = function(year) {
                    // $scope[year].sumTax = $scope.salaryTaxInfo.income | 0 + 123;
                    $scope[year].total = allItems.reduce(function(p, item) {
                        return (p | 0) + ($scope[year][item + 'Tax'] | 0)
                    });
                };

                //cant handle nested
                $scope.diff = function(propKey) {
                    return $scope.$eval('y2014.' + propKey) - $scope.$eval('y2013.' + propKey);
                    // return $scope['y2014'][propKey] - $scope['y2013'][propKey];
                };

                //http://www.gov.hk/tc/residents/taxes/taxfiling/taxrates/salariesrates.htm#pr
                var calculateIncomeTax = function(year) {
                    var income =  $scope.salaryTaxInfo.income;
                    var deduction=   calculateDeductions(year);
                    var totalAllowances = calculateAllowances(year);
                    var taxPayable = calculator.calculateTax(year,income,deduction,totalAllowances);
                    var reductions = calculateReductions(year,taxPayable);

                    var incomeTax = taxPayable-reductions;
                    $scope[year]['salaryTax'] = incomeTax;
                    console.log('incomeTax '+year+' '+$scope[year].salaryTax);

                    return incomeTax;
                };

                var calculateReductions = function(year,taxPayable) {
                    return $scope[year]['salary']['reductions'] = calculator.calReductions(year,taxPayable);
                };
                var calculateDeductions = function(year) {
                    deductionsItems.map(function(item) {
                        $scope[year]['salary']['deductionsEntitled'][item] = $scope.salaryTaxInfo['deductions'][item + 'Count'] * 1;
                    });
                   return  $scope[year]['salary']['deductionsEntitled']['total'] = deductionsItems.reduce(function(p, item) {
                        return (p | 0) + ($scope[year]['salary']['deductionsEntitled'][item] | 0)
                    },0);
                    // return 
                };
                var calculateAllowances = function(year) {
                    allowancesItems.map(function(item) {
                        $scope[year]['salary']['allowancesEntitled'][item] = calculator.calAllowances(year, item, $scope.salaryTaxInfo.allowances[item + 'Count']);
                    });


                    $scope[year]['salary']['allowancesEntitled']['totalChild'] = $scope[year]['salary']['allowancesEntitled']['bornChild'] + $scope[year]['salary']['allowancesEntitled']['child'];

                    $scope[year]['salary']['allowancesEntitled']['dependent55ParentsTotal'] = $scope[year]['salary']['allowancesEntitled']['dependent55Parents'] + $scope[year]['salary']['allowancesEntitled']['dependent55ParentsResidedWith'];
                    $scope[year]['salary']['allowancesEntitled']['dependent60ParentsTotal'] = $scope[year]['salary']['allowancesEntitled']['dependent60Parents'] + $scope[year]['salary']['allowancesEntitled']['dependent60ParentsResidedWith'];

                     $scope[year]['salary']['allowancesEntitled']['basicPerStatus'] =  Math.max($scope[year]['salary']['allowancesEntitled']['basic'],$scope[year]['salary']['allowancesEntitled']['married']);


                    return  $scope[year]['salary']['allowancesEntitled']['total'] = allowancesItems.reduce(function(p, item) {
                        return (p | 0) + ($scope[year]['salary']['allowancesEntitled'][item] | 0);
                    },0);
                };

// salaryTax,  $scope[year]['salary']['allowancesEntitled']['total'], $scope[year]['salary']['reductions'], $scope[year]['salary']['deductionsEntitled']['total'] 


                $scope.$watch('living', function(newVal, oldVal) {
                    calculateLiving('y2013');
                    calculateLiving('y2014');

                    calculateTotal('y2013');
                    calculateTotal('y2014');
                    
                }, true);

                var toggleAllowancesForMarried = function(isMarried) {
                    if(isMarried){
                    $scope.salaryTaxInfo.allowances["marriedCount"] =1;
                    $scope.salaryTaxInfo.allowances["basicCount"] =0;

                    $scope.salaryTaxInfo['allowances']['isSingleParent'] =false;
                    }else{
                    $scope.salaryTaxInfo.allowances["marriedCount"] =0;
                    $scope.salaryTaxInfo.allowances["basicCount"] =1;
                    }


                };
                $scope.$watch('salaryTaxInfo', function(newVal, oldVal) {
                    calculateIncomeTax('y2013');
                    calculateIncomeTax('y2014');


                    calculateTotal('y2013');
                    calculateTotal('y2014');

                    toggleAllowancesForMarried($scope.salaryTaxInfo.maritalStatus ==='married');

                    $scope.salaryTaxInfo['allowances']['singleParentCount'] = $scope.salaryTaxInfo['allowances']['isSingleParent'] === "true" ? 1 : 0;
                    // salary
                    //if married, reset as 0


                }, true);

            }
        ]);
        // .controller('MyCtrl2',
        //     function($scope) {

        //     }, ['$scope']);

    });
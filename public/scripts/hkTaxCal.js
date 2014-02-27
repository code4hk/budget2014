if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {

//TODO rename as this is more than tax but also living feeds

var _calculator = {};

var rates = {
    "y2013": {
        "0": {
            "limit": 40000,
            "rate": 0.02
        },
        "1": {
            "limit": 40000,
            "rate": 0.07
        },
        "2": {
            "limit": 40000,
            "rate": 0.12
        },
        "3": {
            "limit": Number.MAX_VALUE,
            "rate": 0.17
        },
        "standard": {
            "limit": -1,
            "rate": 0.15
        }
    },
    "y2014": {
        "0": {
            "limit": 40000,
            "rate": 0.02
        },
        "1": {
            "limit": 40000,
            "rate": 0.07
        },
        "2": {
            "limit": 40000,
            "rate": 0.12
        },
        "3": {
            "limit": Number.MAX_VALUE,
            "rate": 0.17
        },
        "standard": {
            "limit": -1,
            "rate": 0.15
        }
    }
};
//TODO married
//resided with
var allowances = {
    "y2013": {
        "basic": 120000,
        "married": 240000,
        "child": 70000,
        "bornChild": 140000,
        "dependentSiblings": 33000,
        // "dependentDisabledParents": 38000,
        // "dependentDisabledParentsResidedWith": 76000,
        "dependent60Parents": 38000,
        "dependent60ParentsResidedWith": 76000,
        "dependent55Parents": 19000,
        "dependent55ParentsResidedWith": 38000,
        "singleParent": 120000,
        "disabledDependent": 66000
    },
    "y2014": {
        "basic": 120000,
        "married": 240000,
        "child": 70000,
        "bornChild": 140000,
        "dependentSiblings": 33000,
        // "dependentDisabledParents": 40000,
        "dependent60Parents": 40000, 
        "dependent60ParentsResidedWith": 80000,
        "dependent55Parents": 20000, 
        "dependent55ParentsResidedWith": 40000,
        "singleParent": 120000,
        "disabledDependent": 66000
    }

};

var reduction = {
    "y2013": {
     "percent": 0.75,
        "maximum":"10000",
        "cases":["salary","profits","personal"]
    },
    "y2014": {
        "percent": 0.75,
        "maximum":"10000",
        "cases":["salary","profits","personal"]
    }
};

_calculator.calReductions = function(year,taxPayable) {
    var exceedMax = taxPayable > reduction[year]["maximum"];
    return exceedMax ? reduction[year]["maximum"] : (taxPayable * reduction[year]["percent"]) ;
};

_calculator.calAllowances=function(year,key,count) {
    return allowances[year][key]*(count|0);
};
//not same as deduction



_calculator.calProgressive = function(income,year) {
    var taxable = [];
    var tax = [];
    var r = [];


    var calSeg = function(remain, i) {
        remain = remain > 0 ? remain : 0;
        r[i] = remain - rates[year][i]["limit"];
        taxable[i] = r[i] > 0 ? rates[year][i]["limit"] : remain;
        tax[i] = (taxable[i] * rates[year][i]["rate"]).toFixed();
    };

    calSeg(income, 0);
    calSeg(r[0], 1);
    calSeg(r[1], 2);
    calSeg(r[2], 3);

    console.log("Tax:" + tax);
    console.log("taxable" + taxable);
    var totalTax = tax.reduce(function(p, c) {
        return (p | 0) + (c | 0)
    });
    console.log(totalTax);
    return totalTax;
};

_calculator.calStandardRate = function(incomeBeforeDeduction,year) {
    return (incomeBeforeDeduction * rates[year]["standard"]["rate"]).toFixed();;

};


// totalAllowances
//Tax payable is calculated at progressive ratees on your net chargeable income
//or at standard rate on your net income ( before deduction of allowances), whichever is lower
_calculator.calculateTax = function(year, income,deduction,totalAllowances) {
    var deductedIncome =income-deduction;
    deductedIncome = Math.max(deductedIncome,0);
    var netChargeableIncome = Math.max(deductedIncome -  totalAllowances,0);
    netChargeableIncome = netChargeableIncome>0 ?netChargeableIncome :0;
    var taxProgressive = _calculator.calProgressive(netChargeableIncome,year);
    var taxStandardRate = _calculator.calStandardRate(deductedIncome,year);
    return taxProgressive <=taxStandardRate ?taxProgressive : taxStandardRate;
};

_calculator.calculateElectricty = function() {

};

// _calculator.calTaxableIncomeTax = function(taxableIncome) {

//     return calProgressive(taxableIncome);

// };

// return _calculator;
if(typeof exports == 'undefined'){
    var exports = _calculator;
}
    return exports;
});
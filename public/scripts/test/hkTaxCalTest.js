var assert = require('chai').assert;
var expect = require('chai').expect;

var requirejs = require('requirejs');
// require('../requirejsConfig');
// requirejs.config({
//     nodeRequire: require
// });
// requirejs(['hkTaxCal'], function(hkTaxCal) {
// requirejs(['../hkTaxCal'], function(hkTaxCal) {

var hkTaxCal = require('../hkTaxCal');
suite('hkTaxCal', function() {
    console.log('start')


    test('calculate tax on NetChargeable Income', function() {
        console.log('income');
        // calIncomeTax('1000');
        assert.equal(hkTaxCal.calProgressive(40000, 'y2013'), 800);
        assert.equal(hkTaxCal.calProgressive(80000, 'y2013'), 3600);
        assert.equal(hkTaxCal.calProgressive(120000, 'y2013'), 8400);
        assert.equal(hkTaxCal.calProgressive(1234567, 'y2013'), 197876);

        //

        //Form IRD Allowances and tax rate table 
        assert.equal(hkTaxCal.calProgressive(120000, 'y2013'), 8400);

    });



    test('calculate tax both methods', function() {
        assert.equal(hkTaxCal.calculateTax(12345678, 1000, 120000, 'y2013'), 1851702); //web page is 1851701

    });

    test('calculate with deductions', function() {
        // 12345678,'y2013'
    });

    test('calculate from obj', function() {});

});

// });
// });
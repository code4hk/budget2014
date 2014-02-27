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

//TC1
// 500000

// child:1
//dependent55Parents:2
//348000


//TC2
// Object {income: "2345678", allowances: Object, deductions: Object, maritalStatus: "married"}
// allowances: Object
// basicCount: 1
// bornChildCount: "2"
// childCount: "1"
// dependent55ParentsCount: "2"
// dependent55ParentsResidedWithCount: "3"
// dependent60ParentsCount: "2"
// dependent60ParentsResidedWithCount: "1"
// dependentSiblingsCount: 0
// disabledDependentCount: 0
// isSingleParent: "true"
// marriedCount: 0
// singleParentCount: 1
// __proto__: Object
// deductions: Object
// donationsCount: 0
// mpfCount: 0
// othersCount: "25364"
// outgoingExpensesCount: 0
// selfEduExpensesCount: 0
// __proto__: Object
// income: "2345678"
// maritalStatus: "married"

// 2013_14_budget
// 總 入 息   2,345,678          
// 扣 除 額   25,364          
// 免 稅 額：－
//     基 本 120,000          
//     單 親 120,000          
//     子 女  
//       - 在 課 稅 年 度 內 出 生 280,000          
//       - 在 其 他 課 稅 年 度 出 生   70,000          
//     供 養 兄 弟 / 姊 妹   0          
//     供 養 父 母 / 祖 父 母 或 外 祖 父 母    
//       - 年 齡 為 55 至 59 歲 152,000          
//       - 年 滿 60 歲 或 以 上 ， 或 雖 未 滿 60 歲 ， 但 屬 傷 殘 人 士 152,000          
//     傷 殘 受 養 人   0          
// 總 免 稅 額 894,000          
// 應 課 稅 入 息 實 額   1,426,314          
// 你 應 繳 的 總 稅 款 (稅 款 寬 免 前)   230,473          
 
// 稅 款 寬 免 款 額 10,000          
 
// 你 應 繳 的 總 稅 款 (稅 款 寬 免 後)   220,473                

    test('calculate tax both methods', function() {
        assert.equal(hkTaxCal.calculateTax(12345678, 1000, 120000, 'y2013'), 1851702); //web page is 1851701

    });

    test('calculate with deductions', function() {
        // 12345678,'y2013'
    });

    test('calculate from obj', function() {});


    test('calculate electricity', function() {

        

    });

});

// });
// });
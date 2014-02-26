console.log('init requirejs config');
var require = {
    "map": {},
    "paths": {
        "angular": "../bower_components/angular/angular",
        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min",
        "angular-cookies": "../bower_components/angular-cookies/angular-cookies",
        "angular-mocks": "../bower_components/angular-mocks/angular-mocks",
        "angular-resource": "../bower_components/angular-resource/angular-resource",
        "angular-sanitize": "../bower_components/angular-sanitize/angular-sanitize",
        "angular-route": "../bower_components/angular-route/angular-route",
        "spin-js": "../bower_components/spin.js/spin",
        "hkTaxCal": "hkTaxCal"
    },
    "shim": {
        "angular": {
            "exports": "angular"
        },
        "angular-bootstrap": {
            "deps": [
                "angular"
            ]
        },
        "angular-route": {
            "deps": [
                "angular"
            ]
        },
        "angular-sanitize": {
            "deps": [
                "angular"
            ]
        },
        "hkTaxCal": {}
    },
    "baseUrl": "scripts"
};

if(module != undefined){
    module.exports = require;
}

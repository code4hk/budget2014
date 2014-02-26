require(['angular','app'], function(angular) {
  console.log('bootstrap site');
  var app = angular.module('budget2014')
  
  angular.bootstrap(document, ["budget2014"]);


});


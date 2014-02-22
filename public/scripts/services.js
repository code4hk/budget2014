'use strict';

/* Services */

define(
    ["angular"],function() {

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('budget2014.services', []).
  value('version', '0.1');

});
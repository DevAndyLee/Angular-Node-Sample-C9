'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('testSPA.services', [])
  .service('searchModel', function SearchModel() {
      this.name = '';

      this.json = function () {
          return {
              name: this.name
          };
      };
  })
  .service('backEndServer', ["$http", function ($http) {

      this.analysis = function (params) {
          return $http.get('/api/analysis?name=' + params.name);
      };

      this.getSectors = function (params) {
          return $http.get('/api/getSectors?name=' + params.name);
      };

      this.getTransactions = function (params) {
          return $http.get('/api/getTransactions?name=' + params.name);
      };

      this.getInvestment = function (params) {
          return $http.get('/api/getInvestment?id=' + params.id);
      };
  }]);

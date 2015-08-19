var app = angular.module('consultCalc', ['ngRoute']);


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider

        .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'ConsultCalcController',
        controllerAs: 'consult'
    })

    .when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'ConsultCalcController',
        controllerAs: 'consult'
    })

    .otherwise({
        redirectTo: '/'
    })


    // works with arrive js to initialize material design components on loaded template
    $.material.init();

}]);


app.controller('ConsultCalcController', ['$scope', '$location', function ($scope, $location) {

    'use strict';
    var consult = this;

    consult.itemRows = [];

    consult.addItemRow = function () {
        consult.itemRows.push({
            amount: null,
            quantity: null
        });
    };

    // Replace falsey values.  Default replacement is zero
    function replaceNull(value, replacement) {
        replacement = typeof replacement !== 'undefined' ? replacement : 0;
        return value ? value : replacement;
    };

    consult.calcProductSubTotal = function () {
        var productSubTotal = 0,
            rowTotal;
        for (var i = 0; i < consult.itemRows.length; i++) {
            rowTotal = consult.itemRows[i].amount * consult.itemRows[i].quantity;
            productSubTotal += replaceNull(rowTotal);
        }
        var discount = 1 - consult.discount / 100;
        discount = replaceNull(discount, 1);
        productSubTotal = productSubTotal * discount;
        consult.productSubTotal = productSubTotal;
    };

    consult.calcShippingSubTotal = function () {
        var shippingRate = replaceNull(consult.shippingRate / 100);
        var handlingRate = replaceNull(consult.handlingRate);
        consult.shippingSubTotal = (consult.productSubTotal * shippingRate) + handlingRate;
        consult.shippingProductSubTotal = consult.shippingSubTotal + consult.productSubTotal;
    };

    consult.calcTaxSubTotal = function () {
        var taxRate = replaceNull(consult.taxRate / 100, 0);
        if (consult.taxShipping) {
            consult.taxSubTotal = (consult.productSubTotal + consult.shippingSubTotal) * taxRate;
        } else {
            consult.taxSubTotal = consult.productSubTotal * taxRate;
        }
    };

    consult.calcGrandTotal = function () {
        consult.grandTotal = consult.productSubTotal + consult.shippingSubTotal + consult.taxSubTotal;
    };

    consult.calcFields = function () {
        consult.calcProductSubTotal();
        consult.calcShippingSubTotal();
        consult.calcTaxSubTotal();
        consult.calcGrandTotal();
    };

    $scope.isActive = function (route) {
        return route === $location.path();
    }

    var init = function () {
        for (var i = 0; i < 3; i++) {
            consult.addItemRow();
        }
        consult.calcFields();
    };

    init();

}]);
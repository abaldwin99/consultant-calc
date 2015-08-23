var app = angular.module('consultCalc', ['ngRoute', 'LocalStorageModule']);

// Routing setup
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

    .when('/settings', {
        templateUrl: 'pages/settings.html',
        controller: 'ConsultCalcController',
        controllerAs: 'consult'
    })

    .otherwise({
        redirectTo: '/'
    });


    // works with arrive js to initialize material design components on loaded template
    $.material.init();

}]);

// Local Storage Setup
app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('consultCalc')
        .setStorageCookie(0, '/')
        .setStorageCookieDomain('');
}]);


app.controller('ConsultCalcController', ['$scope', '$location', 'localStorageService', function ($scope, $location, localStorageService) {

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
    }

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
    };

    consult.saveSettings = function () {
        localStorageService.set('settingDiscount', consult.settingDiscount);
        localStorageService.set('settingShippingRate', consult.settingShippingRate);
        localStorageService.set('settingHandlingRate', consult.settingHandlingRate);
        localStorageService.set('settingTaxRate', consult.settingTaxRate);
        localStorageService.set('settingTaxShipping', consult.settingTaxShipping);
    };

    consult.resetSettings = function () {
        if (confirm('Are you sure you want to reset the settings?')) {
            localStorageService.set('settingDiscount', 0);
            localStorageService.set('settingShippingRate', 0);
            localStorageService.set('settingHandlingRate', 0);
            localStorageService.set('settingTaxRate', 0);
            localStorageService.set('settingTaxShipping', false);
            init();
        }
    };

    var init = function () {
        // Fill the line items with 3 rows to start
        for (var i = 0; i < 3; i++) {
            consult.addItemRow();
        }

        // Load user's default settings into main calculator and settings page
        consult.discount = consult.settingDiscount = localStorageService.get('settingDiscount');
        consult.shippingRate = consult.settingShippingRate = localStorageService.get('settingShippingRate');
        consult.handlingRate = consult.settingHandlingRate = localStorageService.get('settingHandlingRate');
        consult.taxRate = consult.settingTaxRate = localStorageService.get('settingTaxRate');
        consult.taxShipping = consult.settingTaxShipping = localStorageService.get('settingTaxShipping');

        consult.calcFields();
    };

    init();

}]);

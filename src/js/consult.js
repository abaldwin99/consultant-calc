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
            rowTotal = consult.itemRows[i].amount * (consult.itemRows[i].quantity ? consult.itemRows[i].quantity : 1);
            productSubTotal += replaceNull(rowTotal);
        }
        var discount = 1 - consult.discount / 100;
        discount = replaceNull(discount, 1);
        productSubTotal = productSubTotal * discount;
        consult.productSubTotal = Math.round10(productSubTotal, -2);
    };

    consult.calcShippingSubTotal = function () {
        var shippingRate = replaceNull(consult.shippingRate / 100);
        var handlingRate = replaceNull(consult.handlingRate);
        consult.shippingSubTotal = Math.round10(consult.productSubTotal * shippingRate + handlingRate, -2);
        consult.shippingProductSubTotal = consult.shippingSubTotal + consult.productSubTotal;
    };

    consult.calcTaxSubTotal = function () {
        var taxRate = replaceNull(consult.taxRate / 100, 0);
        if (consult.taxShipping) {
            consult.taxSubTotal = (consult.productSubTotal + consult.shippingSubTotal) * taxRate;
        } else {
            consult.taxSubTotal = consult.productSubTotal * taxRate;
        }
        consult.taxSubTotal = Math.round10(consult.taxSubTotal, -2);
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

    consult.resetForm = function () {
        if (confirm('Reset this form?')) {
            init();
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }
    };

    consult.saveSettings = function () {
        localStorageService.set('settingDiscount', zeroToNull(consult.settingDiscount));
        localStorageService.set('settingShippingRate', zeroToNull(consult.settingShippingRate));
        localStorageService.set('settingHandlingRate', zeroToNull(consult.settingHandlingRate));
        localStorageService.set('settingTaxRate', zeroToNull(consult.settingTaxRate));
        localStorageService.set('settingTaxShipping', consult.settingTaxShipping);
        $location.path("/home");
    };

    consult.resetSettings = function () {
        if (confirm('Are you sure you want to change settings to the default?')) {
            localStorageService.set('settingDiscount', null);
            localStorageService.set('settingShippingRate', null);
            localStorageService.set('settingHandlingRate', null);
            localStorageService.set('settingTaxRate', null);
            localStorageService.set('settingTaxShipping', false);
            init();
        }
    };

    var init = function () {
        consult.itemRows = [];
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

// Helper Functions
function zeroToNull(n) {
    if (n === 0) {
        return null;
    }
    return n;
}

//  A rounding function that eliminates edge cases with floating point numbers
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
})();

var app = angular.module('consultCalc', []);

app.controller('ConsultCalcController', function ($scope) {

    'use strict';

    var consult = this;

    consult.test = "";

    consult.itemRows = [];

    consult.page = 'main';

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
        //        var discount = (consult.discount ? 1 - consult.discount / 100 : 1);
        var discount = 1 - consult.discount / 100;
        discount = replaceNull(discount, 1);
        productSubTotal = productSubTotal * discount;
        consult.productSubTotal = productSubTotal;
    };

    consult.calcShippingSubTotal = function () {
        var shippingRate = replaceNull(consult.shippingRate / 100);
        var handlingRate = replaceNull(consult.handlingRate);
        consult.shippingSubTotal = (consult.productSubTotal * shippingRate) + handlingRate;
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

    var init = function () {
        for (var i = 0; i < 3; i++) {
            consult.addItemRow();
        }
        consult.calcFields();
    };

    init();

    consult.loadPage = function (page) {
        consult.page = page;
    };

});

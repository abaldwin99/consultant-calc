angular.module('consultCalc', []).controller('ConsultCalcController', function () {

    'use strict';

    var consult = this;

    consult.test = "";

    consult.itemRows = [];

    consult.addItemRow = function () {
        consult.itemRows.push({
            amount: null,
            quantity: null
        });
    };

    consult.calcProductSubTotal = function () {
        var productSubTotal = 0,
            rowTotal;
        for (var i = 0; i < consult.itemRows.length; i++) {
            rowTotal = consult.itemRows[i].amount * consult.itemRows[i].quantity;
            productSubTotal += rowTotal ? rowTotal : 0;
        }
        var discount = (consult.discount ? 1 - consult.discount / 100 : 1);
        productSubTotal = productSubTotal * discount;
        consult.productSubTotal = productSubTotal;
    };

    consult.calcShippingSubTotal = function () {
        var shippingRate = (consult.shippingRate ? consult.shippingRate / 100 : 0);
        var handlingRate = consult.handlingRate ? consult.handlingRate : 0;
        consult.shippingSubTotal = (consult.productSubTotal * shippingRate) + handlingRate;
    };

    consult.calcTaxSubTotal = function () {
        var taxRate = consult.taxRate ? consult.taxRate / 100 : 0;
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

});

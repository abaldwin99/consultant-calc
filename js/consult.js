angular.module('consultCalc', [])
    .controller('ConsultCalcController', function () {

        var consult = this;

        consult.test = "";

        consult.itemRows = []

        consult.addItemRow = function () {
            consult.itemRows.push({
                amount: null,
                quantity: null
            })
        };

        consult.calcProductSubTotal = function () {
            var productSubTotal = 0;
            var rowTotal;
            for (var i = 0; i < consult.itemRows.length; i++) {
                rowTotal = consult.itemRows[i].amount * consult.itemRows[i].quantity;
                productSubTotal += rowTotal ? rowTotal : 0;
            };
            var discount = (consult.discount ? consult.discount / 100 - 1 : 1);
            productSubTotal = productSubTotal * discount;
            consult.productSubTotal = productSubTotal;
        };

        consult.calcShippingSubTotal = function () {
            var shippingRate = (consult.shippingRate ? consult.shippingRate / 100 : 0);
            var handlingRate = consult.handlingRate ? consult.handlingRate : 0
            consult.shippingSubTotal = (consult.productSubTotal * shippingRate) + handlingRate
        };

        consult.calcFields = function () {
            consult.calcProductSubTotal()
            consult.calcShippingSubTotal()
        };



        var init = function () {
            for (var i = 0; i < 3; i++) {
                consult.addItemRow();
            };
            consult.calcFields();
        };

        init();

    });

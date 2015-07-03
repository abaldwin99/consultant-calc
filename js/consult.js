angular.module('consultCalc', [])
    .controller('ConsultCalcController', function () {

        var consult = this;

        consult.test = "";

        consult.itemRows = []

        consult.addItemRow = function () {
            consult.itemRows.push({
                amount: '',
                quantity: ''
            })
        };

        var init = function () {
            for (var i = 0; i < 3; i++) {
                consult.addItemRow();
            };
        };

        init();

    });

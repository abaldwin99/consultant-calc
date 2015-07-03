angular.module('consultCalc', [])
    .controller('ConsultCalcController', function () {

        var consult = this;

        consult.test = "";

        consult.itemRows = [
            {
                amount: '',
                quantity: ''
            },
            {
                amount: '',
                quantity: ''
            },
            {
                amount: '',
                quantity: ''
            }
        ];

        consult.addItemRow = function () {
            consult.itemRows.push({
                amount: '',
                quantity: ''
            })
        };
    });

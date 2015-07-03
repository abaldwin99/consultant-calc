angular.module('consultCalc', [])
    .controller('ConsultCalcController', function () {

        var consult = this;

        this.test = "";

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



    });
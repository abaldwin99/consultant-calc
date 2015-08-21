$(document).ready(function () {

    // Disables mousewheel scroll from changing values inside input boxes
    // http://stackoverflow.com/questions/9712295/disable-scrolling-on-input-type-number
    $('div').on('focus', 'input[type=number]', function (e) {
        $(this).on('mousewheel.disableScroll', function (e) {
            e.preventDefault();
        });
    });
    $('div').on('blur', 'input[type=number]', function (e) {
        $(this).off('mousewheel.disableScroll');
    });
    $(".navbar-nav li a").click(function (event) {
        $(".navbar-collapse").collapse('hide');
    });
});
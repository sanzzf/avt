/*----------------------------------------------------------
Script name:       IE8
Author:            Paul Cowtan
Created date:      28/11/2014
Notes:             JS polyfills and fallbacks for CSS items that lack IE8 support
----------------------------------------------------------*/
$(function () {
    // polyfill for indexOf()
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    // nth-child selector JS fallbacks
    $('.twoCol > .col:nth-child(2n+1), .threeCol > .col:nth-child(3n+1), .fourCol > .col:nth-child(4n+1), .fourColRestricted > .col:nth-child(4n+1), .sixCol > .col:nth-child(6n+1), .eightCol > .col:nth-child(8n+1)').addClass('newRow');
    $('.colList > .fellowAlert:nth-child(3n)').addClass('noBorder');
    $('.colList > .fellowAlert:nth-child(3n+1)').addClass('reducedSpacing');
    // replacement for play icon on before element
    $('.imageContainer.iconPlay').removeClass('icon iconPlay').prepend('<div class="ieIconPlay">&#xe612;</div>');
    // fix for datepicker popup position in forms for marketers form
    $('#bookingForm .datepicker').on('click', function () {
        var position = $(this).parent().offset().top + $(this).outerHeight();
        $('#ui-datepicker-div').css('top', position);
    });
});
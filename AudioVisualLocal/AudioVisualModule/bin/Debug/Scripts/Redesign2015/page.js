/*----------------------------------------------------------
Script name:       Page
Author:            Paul Cowtan
Created date:      24/02/2015
Notes:             Shared functionality used on select pages of the site
----------------------------------------------------------*/
$.support.cssProperty = (function () {
    'use strict';
    /// <summary>
    /// Checks if a given CSS property is supported, taken from https://gist.github.com/jackfuchs/556448
    /// </summary>
    function cssProperty(p, rp) {
        var b = document.body || document.documentElement,
        s = b.style;
        if (typeof s == 'undefined') { return false; }
        if (typeof s[p] == 'string') { return rp ? p : true; }
        var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms', 'Icab'],
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for (var i = 0; i < v.length; i++) {
            if (typeof s[v[i] + p] == 'string') { return rp ? (v[i] + p) : true; }
        }
        return false;
    }
    return cssProperty;
})();

// reveal hidden areas
$('.reveal').off().on('click', function () {
    var self = $(this);
    var contentToReveal = self.attr('data-revealedContentId');
    var revealedText = self.attr('data-revealedText');
    var unrevealedText = self.attr('data-unrevealedText');
    if ($('#' + contentToReveal).length > 0) {
        if (self.hasClass('active')) {
            self.parent().children('[data-revealedContentId="' + contentToReveal + '"]').removeClass('active').text(unrevealedText);
            $('#' + contentToReveal).slideUp();
        } else {
            var openItem = self.parent().children('.revealedContent.open');
            if (openItem.length > 0) {
                openItem.removeClass('open').slideUp(250, function () {
                    self.parent().children('.reveal').removeClass('active');
                    self.parent().children('[data-revealedContentId="' + contentToReveal + '"]').addClass('active').text(revealedText);
                    $('#' + contentToReveal).addClass('open').slideDown(250);
                });
            } else {
                self.parent().children('.reveal').removeClass('active');
                self.parent().children('[data-revealedContentId="' + contentToReveal + '"]').addClass('active').text(revealedText);
                $('#' + contentToReveal).addClass('open').slideDown(250);
            }
            // re-run lazyloading of images for previously hidden images if there are any
            if ($('#' + contentToReveal).find('.lazyLoad').length > 0) {
                var getNewImages = new imageSizes();
            }
        }
    }
    return false;
});
// reveal hidden areas and scroll to the revealed content
$('.scrollToReveal').off().on('click', function () {
    var self = $(this);
    var contentToReveal = '#' + self.attr('data-revealedContentId');
    if ($(contentToReveal).length > 0) {
        if (self.hasClass('active')) {
            self.removeClass('active');
            $(contentToReveal).hide();
        } else {
            $('.scrollToReveal').removeClass('active');
            $('.revealedContent').hide();
            self.addClass('active');
            $(contentToReveal).show();
            // re-run lazyloading of images for previously hidden images if there are any
            if ($(contentToReveal).find('.lazyLoad').length > 0) {
                var getNewImages = new imageSizes();
            }
            $('.squareCard').each(function () {
                setCardHeight($(this), 1);
                checkCardHeight($(this));
            });
            $('html, body').animate({
                scrollTop: $(contentToReveal).offset().top - 22
            }, 500);
            // bind hide button if there is one
            if ($(contentToReveal).find('.hideBtn').length > 0) {
                $('.hideBtn').off().on('click', function () {
                    self.removeClass('active');
                    $(contentToReveal).hide();
                    return false;
                });
            }
        }
    }
    return false;
});

// additional bindings to cross page functionality
$('.goToResults').off().on('click', function () {
    $('html, body').animate({
        scrollTop: $('#searchResultsAnchor').offset().top
    }, 500);
    return false;
});
$('.moreFilters').off().on('click', function () {
    $(this).parent().addClass('allFiltersShown');
    return false;
});

// expandable biography functionality on the fellow profile page
var bindExpandableBio = function (maxHeight, totalHeight) {
    'use strict';
    /// <summary>
    /// Expand and contract the biography when the show full biography is clicked
    /// </summary>
    /// <param name="maxHeight" type="number">The css restrictred height of the biography text</param>
    /// <param name="totalHeight" type="number">The full height of the biography text</param>
    $('.toggleExpandable').off().on('click', function () {
        if ($(this).prev().height() === parseInt(maxHeight)) {
            $(this).prev().css({ 'max-height': totalHeight });
            $(this).find('span').addClass('open').text('Hide full biography');
        } else {
            $(this).prev().css({ 'max-height': maxHeight });
            $(this).find('span').removeClass('open').text('Show full biography');
        }
        return false;
    });
};
$('.expandableBio').each(function () {
    var maxHeight = $(this).height();
    var totalHeight = $(this)[0].scrollHeight;
    if (maxHeight < totalHeight) {
        $(this).after('<a class="toggleExpandable" href="#"><span class="icon iconArrowDown">Show full biography</span></a>');
        bindExpandableBio(maxHeight, totalHeight);
    }
});

// venue hire feature functionality on the venue hire page
$('.eventTypeFeatured:not(:first-child)').hide();
$('.eventType').off().on('click', function () {
    var eventToShow = $(this).attr('data-eventType');
    if (eventToShow.length > 0) {
        Core.mediaQuery('(max-width: 950px)', function (mql) {
            if (mql.matches) {
                var offset = 11;
                if ($('.stickyHeader').is(':visible')) {
                    offset += 55;
                }
                $('html, body').animate({
                    scrollTop: $('.eventTypeGallery').offset().top - offset
                }, 500);
            }
        });
        $('.eventTypeFeatured').hide();
        $('.eventType').removeClass('active');
        $(this).addClass('active');
        $('#' + eventToShow).show();
    }
    return false;
});

// sticky resgistration panel functionality on the event detail page
var stickyPanel = {};
stickyPanel.container = $('#stickyPanel');
if (stickyPanel.container.length > 0) {
    stickyPanel.startPosition = stickyPanel.container.position();
    var doStickyDebounce = Core.debounce(function () {
        if (stickyPanel.container.is(':visible')) {
            Core.mediaQuery('(max-width: 1280px)', function (mql) {
                if (mql.matches) {
                    stickyPanel.container.outerWidth(stickyPanel.container.parent().width());
                } else {
                    stickyPanel.container.outerWidth('auto');
                }
            });
            stickyPanel.startPosition = stickyPanel.container.parent().position();
            stickyPanel.maxPosition = $('.globalFooter').offset().top - stickyPanel.container.outerHeight() - 88;
            stickyPanel.setPosition = function () {
                stickyPanel.windowPos = $(window).scrollTop();
                if (stickyPanel.windowPos >= (stickyPanel.startPosition.top - 22) && stickyPanel.windowPos < stickyPanel.maxPosition) {
                    stickyPanel.container.addClass('stick');
                    stickyPanel.container.css({ position: '', top: '' });
                } else if (stickyPanel.windowPos >= stickyPanel.maxPosition) {
                    stickyPanel.container.removeClass('stick');
                    stickyPanel.container.css({ position: 'absolute', top: (stickyPanel.maxPosition + 22) + 'px' });
                } else {
                    stickyPanel.container.removeClass('stick');
                }
            };
            stickyPanel.setPosition();
            $(window).scroll(function () {
                stickyPanel.setPosition();
            });
        }
    }, 250);
    Core.bindEvent(window, 'resize', function () {
        doStickyDebounce();
    });
    doStickyDebounce();
}

// if page has initialisations within the page markup (via CMS) fire this on DOMContentLoaded - jQuery not used to prevent this having to go in the document head
if (typeof initialiseOnLoad == 'function') {
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function () {
            initialiseOnLoad();
        });
    } else {
        // IE8 fallback
        window.onload = function () {
            initialiseOnLoad();
        }
    }
}

// drop downs for IE10 and below
if (Core.getIEVersion() > 0 && Core.getIEVersion() < 11) {
    $('.styledSelect').addClass('ieDropDown');
    if (Core.getIEVersion() === 10) {
        $('.styledSelect').addClass('ie10DropDown');
    }
}

// interact tabs intialisation
var pageTabs = new interact.tabs({
    wrapper: '.pageTabs'
});

// fellow alert dismiss
$('.fellowAlert .iconCross').off().on('click', function () {
    var alert = $(this).parent();
    $.get('/api/Fellows/MarkFellowsUpdateSeen?sitecoreId=' + alert.attr('data-guid'), function () {
        alert.remove();
    });
    return false;
});

// responsive tables in RTE areas, because we dont have a custom table control
$('.rteContent table').each(function () {
    var thisTable = $(this);
    thisTable.find('th').each(function () {
        thisTable.find('td:nth-child(' + ($(this).index() + 1) + ')').attr('data-th', $(this).text());
    });
});
/*----------------------------------------------------------
Script name:       Main
Author:            Paul Cowtan
Created date:      21/11/2014
Notes:             Various functionality used on every page throughout the site
----------------------------------------------------------*/
var buildNavigation = function () {
    'use strict';
    /// <summary>
    /// Builds the appropriate navigation functionality depedning on if we are on a large or small screen
    /// </summary>
    if ($('#showSideNav').is(':visible')) {
        $('#mainNavLevel2').hide();
        // show side navigation when icon is clicked
        $('#showSideNav').off().on('click', function () {
            $('.siteContainer').toggleClass('sideNavVisible');
            return false;
        });
        // bind functionality to side navigation items
        $('#offScreenNav > ul > li > a').on('click', function () {
            var parent = $(this).parent();
            if (parent.hasClass('open')) {
                window.location = $(this).attr('href');
            } else {
                $('#offScreenNav li').removeClass('open');
                if (parent.find('ul').length > 0) {
                    parent.addClass('open');
                }
                $('html, body').scrollTop($(this).offset().top);
            }
            return false;
        });
    } else {
        var buildLevel2Menu = function (parentIndex) {
            /// <summary>
            /// Builds the second level menu and adds an overflow drop down menu if there are too many links for the width of the page
            /// </summary>
            /// <param name="parentIndex" type="number">The index of the main first level menu item to build the second level from</param>
            $('#mainNavLevel2 .level2Menu').hide();
            $('.overflowMenu').hide().find('ul').empty().removeAttr('style');
            $('.overflowAccordion').removeClass('open');
            $('.overflowAccordion').off().on('click', function () {
                return false;
            });
            $('#mainNavLevel2').show();
            $('#mainNavLevel2 .level2Menu:nth-child(' + (parentIndex + 1) + ')').show();
            var itemsWidth = 0;
            var overflowNeeded = false;
            var wrapperWidth = $('#mainNavLevel2 .wrapper').width() - 100;
            $('#mainNavLevel2 .level2Menu:nth-child(' + (parentIndex + 1) + ') li').each(function () {
                itemsWidth += $(this).outerWidth();
                if (itemsWidth > wrapperWidth) {
                    $(this).show();
                    $(this).clone().appendTo('.overflowMenu ul');
                    $(this).hide();
                    overflowNeeded = true;
                }
            });
            if (overflowNeeded) {
                $('.overflowMenu').show();
                var overflowAccordion = new interact.accordion({
                    wrapper: '.overflowMenu',
                    selector: '.overflowAccordion'
                });
            }
            $('#mainNavLevel2').addClass('open');
        };
        // when hovering on a first level menu item build the second level for that item after a short delay, clicking will go to the page as normal
        $('#mainNav li a').on('mouseenter', function () {
            var thisNavItem = $(this);
            var hoverDelay = setTimeout(function () {
                buildLevel2Menu(thisNavItem.parent().index());
            }, 70);
            thisNavItem.on('mouseleave click', function () {
                clearTimeout(hoverDelay);
            });
        });
        // on a touch device the first touch on a first level menu item will build the second level, a second touch will go to the page as normal
        $('#mainNav li a').on('touchstart', function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                window.location = $(this).attr('href');
            } else {
                $('#mainNav a').removeClass('active');
                $(this).addClass('active');
                buildLevel2Menu($(this).parent().index());
            }
        });
        // if the level 2 menu needs to be open on load just build it
        if ($('#mainNav .active').length > 0) {
            buildLevel2Menu($('#mainNav .active').index());
        }
    }
};

// bindings to generic links on every page
$('.backToTop').off().on('click', function () {
    $('html, body').animate({
        scrollTop: 0
    }, 1000);
    return false;
});
$('#showSearch').off().on('click', function () {
    $('.activeTopLink').removeClass('activeTopLink');
    $(this).addClass('activeTopLink');
    $('.fellowLogin').hide();
    $('.siteSearch').fadeIn('slow');
    $('.drawer').addClass('openDrawer');
    return false;
});
$('#showLogin').off().on('click', function () {
    $('.activeTopLink').removeClass('activeTopLink');
    $(this).addClass('activeTopLink');
    $('.siteSearch').hide();
    $('.fellowLogin').fadeIn('slow');
    $('.drawer').addClass('openDrawer');
    return false;
});

var bindFlip = function (toggleElement) {
    'use strict';
    /// <summary>
    /// Bind the 3D card flip functionality
    /// </summary>
    /// <param name="toggleElement" type="string">The class of the element that triggers the flip</param>
    var toggle = $(toggleElement);
    toggle.off().on('click touchend', function () {
        $('.flipContainer').removeClass('interacted');
        $(this).parent().parent().removeClass('hoveredY').toggleClass('reverseY').parent().addClass('interacted');
        return false;
    });
    toggle.on('mouseover', function () {
        $(this).parent().parent().addClass('hoveredY');
    });
    toggle.on('mouseout', function () {
        $(this).parent().parent().removeClass('hoveredY');
    });
};
bindFlip('.toggleFlip');

var setCardHeight = function (element, ratio) {
    'use strict';
    /// <summary>
    /// Set height of cards based on the passed ratio
    /// </summary>
    /// <param name="element" type="string">The card being sized</param>
    /// <param name="ratio" type="number">The ratio the card needs to be sized to expressed in decimal form (e.g. 2:1 would be 0.5)</param>
    element.height(Math.floor(element.width() * ratio) + element.find('.front .flipContent').outerHeight());
};

var checkCardHeight = function (card) {
    'use strict';
    /// <summary>
    /// Check to see if the content on the card is too much to fit, if so add a class so we can truncate the content
    /// </summary>
    /// <param name="card" type="number">The card being checked</param>
    if ((card.find('.front .flipContent p').outerHeight() + 10) > card.find('.front .flipContent').outerHeight()) {
        card.addClass('overflowedCardFront');
    } else {
        card.removeClass('overflowedCardFront');
    }
    if (card.find('.back .flipContent').outerHeight() > card.height()) {
        card.addClass('overflowedCardBack');
    } else {
        card.removeClass('overflowedCardBack');
    }
};

var stickyHeaderDisplay = function () {
    'use strict';
    /// <summary>
    /// Check if sticky header should be displayed
    /// </summary>
    if ($(window).scrollTop() > $('.globalHeader').outerHeight()) {
        $('.stickyHeader').show();
        bindStickyHeader();
    } else {
        $('.stickyHeader').hide();
    }
};

var bindStickyHeader = function () {
    'use strict';
    /// <summary>
    /// Bind sticky header links
    /// </summary>
    $('#stickyShowSearch').off().on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1000, function () {
            $('#showSearch').click();
        });
        return false;
    });
    $('#stickyShowSideNav').off().on('click', function () {
        $('html, body').scrollTop(0);
        $('.siteContainer').addClass('sideNavVisible');
        return false;
    });
};

var mainDebounce = Core.debounce(function () {
    'use strict';
    /// <summary>
    /// Main debounced function that runs on load and when a page resize has ended
    /// </summary>
    buildNavigation();
    // card resizing
    var homeWidth = $('.homeCard').width();
    var newHomeWidth = Math.round(homeWidth * 0.5133333333);
    if (homeWidth < 444) {
        newHomeWidth += $('.homeCard .homeFlipOverlay').outerHeight();
    }
    $('.homeCard').height(newHomeWidth);
    $('.fourFifthCard').each(function () {
        setCardHeight($(this), 0.8);
        checkCardHeight($(this));
    });
    $('.squareCard').each(function () {
        setCardHeight($(this), 1);
        checkCardHeight($(this));
    });
    // about us pods equal heights
    $('.spotlight .imageOverlay').removeAttr('style');
    Core.mediaQuery('(min-width: 691px) and (max-width: 1150px)', function (mql) {
        if (mql.matches) {
            Core.equalHeights($('.spotlight .imageOverlay'));
        }
    });
    // fellow calendar equal heights
    $('.fellowCalendar').removeAttr('style');
    Core.mediaQuery('(min-width: 641px)', function (mql) {
        if (mql.matches) {
            Core.equalHeights($('.fellowCalendar'));
        }
    });
    // policy project equal heights
    $('.projectTitle, .projectText').removeAttr('style');
    Core.mediaQuery('(min-width: 521px)', function (mql) {
        if (mql.matches) {
            Core.equalHeights($('.projectTitle'));
            Core.equalHeights($('.projectText'));
        }
    });
    // navigation switch to mobile menu
    Core.mediaQuery('(max-width: 950px)', function (mql) {
        if (mql.matches) {
            $('.drawer').removeClass('startOpen');
        } else {
            $('.siteContainer').removeClass('sideNavVisible');
        }
    });
    // sticky header
    Core.mediaQuery('(max-width: 580px)', function (mql) {
        if (mql.matches) {
            stickyHeaderDisplay();
            $(window).scroll(function () {
                stickyHeaderDisplay();
            });
        }
    });
}, 250);
Core.bindEvent(window, 'resize', function () {
    mainDebounce();
});
mainDebounce();

// Sharey initialisation
var sharey = new Sharey();
var shareyConfig = {
    selector: '.shareLinks',
    facebook: {
        title: 'Share us on facebook',
        className: 'icon iconFacebook'
    },
    twitter: {
        title: 'Tweet about us!',
        className: 'icon iconTwitter'
    },
    googlePlus: {
        title: 'Google +1 us',
        className: 'icon iconGooglePlus'
    },
    linkedIn: {
        title: 'Share us on LinkedIn',
        className: 'icon iconLinkedIn'
    },
    pinterest: {
        title: 'Pin to Pinterest',
        className: 'icon iconPinterest'
    }
};

// Cookied initialisation
var rsCookied = new cookied();
rsCookied.Options.position = 'bottom';
rsCookied.Options.message = 'We use cookies to help us improve this website.';
rsCookied.Options.cookiePolicyLink = '/about-us/website/cookies/';
rsCookied.Options.cookiePolicyLinkText = 'Learn more';
rsCookied.Init();

// Fonts.com tracking script - do not remove
var MTIProjectId = '55adb293-9b1e-41b8-9017-31b4fafaf1c8';
(function () {
    var mtiTracking = document.createElement('script');
    mtiTracking.type = 'text/javascript';
    mtiTracking.async = 'true';
    mtiTracking.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + '//fast.fonts.net/t/trackingCode.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(mtiTracking);
})();
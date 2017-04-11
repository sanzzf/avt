/*--------------------------------------------------
Script name: 	   Core
Author:			   Paul Cowtan
Version:		   1.0.1
Created:	       21/11/2014
Notes:             Core functionality library but modified for RS - unused functions removed, mediaQuery and debounce functions added
------------------------------------------------*/
var Core = (function () {
    'use strict';
    var core = {};
    core.bindEvent = function (el, eventName, eventHandler) {
        /// <summary>
        /// Binds a given event to a given element
        /// </summary>
        /// <param name="el" type="HTMLElement"></param>
        /// <param name="eventName" type="function"></param>
        /// <param name="eventHandler" type="event"></param>
        if (el.addEventListener) {
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, eventHandler);
        }
    };
    core.unbindEvent = function (el, eventName, eventHandler) {
        /// <summary>
        /// Unbinds a given event from a given element
        /// </summary>
        /// <param name="el" type="HTMLElement"></param>
        /// <param name="eventName" type="function"></param>
        /// <param name="eventHandler" type="event"></param>
        if (el.removeEventListener) {
            el.removeEventListener(eventName, eventHandler, false);
        } else if (el.detachEvent) {
            el.detachEvent('on' + eventName, eventHandler);
        }
    };
    core.equalHeights = function (els) {
        /// <summary>
        /// Equalise the height of an array of elements
        /// </summary>
        /// <param name="els" type="array">Array of HTML Elements</param>
        var i, height = 0;
        for (i = 0; i < els.length; i++) {
            var elHeight = $($(els)[i]).height();
            if (elHeight > height) {
                height = elHeight;
            }
        }
        $(els).height(height);
    };
    core.getIEVersion = function () {
        /// <summary>
        /// Checks current version of Internet Explorer, if not IE returns -1
        /// </summary>
        /// <returns type="number"></returns>
        var rv = -1;
        if (navigator.appName === 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    };
    core.mediaQuery = function (query, action) {
        /// <summary>
        /// Constructs a matchMedia object with the given query and runs/binds the listener function
        /// </summary>
        /// <param name="query" type="string">Media Query string</param>
        /// <param name="action" type="function">The listener function which will be passed the mql object with a matches value</param>
        if (core.getIEVersion() > 9 || core.getIEVersion() <= 0) {
            this.media = window.matchMedia(query);
            this.media.addListener(function (mql) {
                action(mql);
            });
            action(this.media);
        } else {
            action('Not supported');
        }
    };
    core.debounce = function (func, wait, immediate) {
        /// <summary>
        /// Debounce function, taken from http://davidwalsh.name/javascript-debounce-function
        /// </summary>
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    return core;
})();
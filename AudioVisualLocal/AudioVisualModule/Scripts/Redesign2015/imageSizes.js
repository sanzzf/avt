/*----------------------------------------------------------
Script name:       Image Sizes
Author:            Paul Cowtan
Created date:      28/11/2014
Notes:             Uses container size and pixel ratio to establish which size image to display then lazy load it
----------------------------------------------------------*/
var imageSizes = function (options) {
    'use strict';
    /// <summary>
    /// Renders images dynamically with given options or uses defaults. Runs Init(), determines which image to use and renders it. Technique is based on article at http://www.smashingmagazine.com/2013/09/16/responsive-images-performance-problem-case-study/
    /// </summary>
    /// <param name="options" type="object">Options object can contain wrap: [selector string], retVal: [number]
    var self = this;
    self.Opt = new imageSizes.Opt(options);
    var getScreenPixelRatio = function () {
        /// <summary>
        /// Establishes the pixel ratio of the device being used to view the site
        /// </summary>
        if (window.devicePixelRatio) {
            self.Opt.RetVal = window.devicePixelRatio;
        } else if ('matchMedia' in window && window.matchMedia) {
            if (window.matchMedia('(min-resolution: 2dppx)').matches || window.matchMedia('(min-resolution: 192dpi)').matches) {
                self.Opt.RetVal = 2;
            } else if (window.matchMedia('(min-resolution: 1.5dppx)').matches || window.matchMedia('(min-resolution: 144dpi)').matches) {
                self.Opt.RetVal = 1.5;
            }
        }
    };
    var lazyLoadImage = function (imageContainer) {
        /// <summary>
        /// Lazy loads the passed image, the size of the image is determined based on the width/height of the container
        /// </summary>
        /// <param name="imageContainer" type="selector">The wrapper for the image to be lazy loaded
        var img = imageContainer.children().first();
        var sizeParams = '';

        var containerWidth = imageContainer.outerWidth() * self.Opt.RetVal;
        var imageWidth = Math.ceil(containerWidth / 100) * 100;
        

        // TEMP STUFF FOR PLACEHOLD.IT, TO BE CHANGED ONCE ALL IMAGES USE SITECORE'S IMAGE HANDLER 
        if (img && img.prop('tagName') === 'NOSCRIPT') {
            if (img.attr('data-src').indexOf('placehold.it') > -1) {
                var containerHeight = imageContainer.outerHeight() * self.Opt.RetVal;
                var aspectRatio = containerHeight / containerWidth;
                var imageHeight = Math.round(imageWidth * aspectRatio);
                sizeParams = imageWidth + 'x' + imageHeight;
            } else {
                sizeParams = '?w=' + imageWidth;
            }
        }
        
        if (img && img.prop('tagName') === 'NOSCRIPT') {
            var imgSRC = img.attr('data-src') + sizeParams;
            var altTxt = img.attr('data-alt');
            if (imgSRC) {
                var imageElement = new Image();
                imageElement.src = imgSRC;
                imageElement.setAttribute('alt', altTxt ? altTxt : '');
                imageContainer.append(imageElement);
                img.remove();
            }
        }
    };
    var Init = (function () {
        /// <summary>
        /// Call function to get pixel ratio, run lazyload for each visible image
        /// </summary>
        if (self.Opt.Wrap.length > 0) {
            getScreenPixelRatio();
            self.Opt.Wrap.each(function () {
                if ($(this).is(':visible')) {
                    lazyLoadImage($(this));
                }
            });
        }
    })();
};
imageSizes.Opt = function (options) {
    'use strict';
    /// <summary>
    /// Build options object from given options or use defaults
    /// </summary>
    /// <param name="options" type="object">Options object can contain wrap: [selector string], retVal: [number]
    options && options.wrap ? this.Wrap = $(options.wrap) : this.Wrap = $('.lazyLoad');
    options && options.retVal ? this.RetVal = $(options.retVal) : this.RetVal = 1;
};
var getImages = new imageSizes();
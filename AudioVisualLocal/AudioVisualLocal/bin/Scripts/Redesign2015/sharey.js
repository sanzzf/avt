// note that this has been modified for RS

var Sharey = (function () {
    /// <summary>Returns object based on passed arguments</summary>
    'use strict';

    var buildServices = function (services) {
        for(var service in services) {
            if(service in defaultServices) {
                console.warn('Overwriting defaultService ' + service);
            }
            defaultServices[service] = services[service];
        };

        return defaultServices;
    };

    // First, checks if it isn't implemented yet.
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
            });
        };
    }

    var formatMarkup = function(options, service, serviceName, obj) {
        if(typeof options === 'undefined') {
            options = jQuery.extend(true, {}, defaultMarkup);
            options.title = options.title + serviceName;
        }
        var string = '<a href="{4}" class="{1}" title="{3}" target="_blank"><span class="offScreen">{3}</span></a>';
        string = string.format(obj.wrap, options.className, options.iconURL, options.title, service.string());
        $(obj.selector).append(string);
    };

    var defaultMarkup = {
        title : 'Share us on ',
        iconURL : 'http://placehold.it/50x50',
        className : 'sharey'
    }

    var defaultServices = {
        twitter : {
            segments : {
                base : 'https://twitter.com/share?',
                url : '&url=' + window.location
            },
            string : function() {
                return this.segments.base + encodeURI(this.segments.url);
            }
        },
        facebook : {
            segments : {
                base : 'https://facebook.com/sharer/sharer.php?',
                url : 'u=' + window.location
            },
            string : function() {
                return this.segments.base + encodeURI(this.segments.url);
            }
        },
        pinterest : {
            segments : {
                base : 'https://www.pinterest.com/pin/create/button/?',
                url : 'url=' + window.location,
                media : '&media=/images/Redesign2015/crest-footer.png'
            },
            string : function() {
                return this.segments.base + encodeURI(this.segments.url + this.segments.media);
            }
        },
        googlePlus: {
            segments: {
                base: 'https://plus.google.com/share?',
                url: 'url=' + window.location
            },
            string: function () {
                return this.segments.base + encodeURI(this.segments.url);
            }
        },
        linkedIn: {
            segments: {
                base: 'https://www.linkedin.com/shareArticle?mini=true',
                url: '&url=' + window.location,
                title: '&title=' + document.title
            },
            string: function () {
                return this.segments.base + encodeURI(this.segments.url + this.segments.title);
            }
        }
    };

    return {
        services: function(wantedServices) {
            var serv = {};
            for(var i = 0; i < wantedServices.length; i++) {
                if(wantedServices[i] in defaultServices) {
                    serv[wantedServices[i]] = defaultServices[wantedServices[i]];
                }
            }

            return serv;
        },

        addServices: function(newServices) {
            return buildServices(newServices);
        },

        mutateMarkup: function (opts) {
            for(var service in opts.services) {
                formatMarkup(opts[service], opts.services[service], service, opts);
            }
        }
    };

});
var interact = {};
// ACCORDION
interact.accordion = function (options) {
    'use strict';
    var self = this;
    self.Opt = new interact.accordion.opt(options);
    var animate = function (obj) {
        if (self.Opt.State === 'open') {
            obj.slideDown(self.Opt.Speed, function () {
                if (self.Opt.OpenCallBack) {
                    self.Opt.OpenCallBack(self.Opt);
                }
            });
        }
        else {
            obj.slideUp(self.Opt.Speed, function () {
                if (self.Opt.CloseCallBack) {
                    self.Opt.CloseCallBack(self.Opt);
                }
            });
        }
    };
    var init = (function () {
        self.Opt.InitialSelector = self.Opt.Selector;
        for (var i = 0; i < $(self.Opt.Wrap).length; i++) {
            // add an id to each accordion section if it doesn't already have one
            var id;
            if ($(self.Opt.Wrap).eq(i).attr('id')) {
                id = $(self.Opt.Wrap).eq(i).attr('id');
            }
            else {
                id = 'accordion_' + i;
                $(self.Opt.Wrap).eq(i).attr('id', id);
            }
            self.Opt.Selector = '#' + id + ' ' + self.Opt.InitialSelector;
            switch (self.Opt.Start) {
                case 'closed':
                    $(self.Opt.Selector).each(function (i, ele) {
                        if (!$(ele).hasClass('open')) {
                            // explicitly set the height on the element to allow the calculation below to work (as element is hidden)
                            //$(ele).next().height($(ele).next().height());
                            //$(window).on('resize', function () {
                            //    $(ele).next().height(function () {
                            //        $(this).css({
                            //            'height': 'auto'
                            //        });
                            //        return $(this).height();
                            //    });
                            //});
                            $(ele).next().hide();
                        }
                    });
                    break;
                case 'open':
                    $(self.Opt.Selector).addClass('open');
            }
            $(self.Opt.Selector).on('click', function () {
                self.Opt.Speed = $(this).next().height() * self.Opt.SpeedMod;
                var obj = $(this).next();
                if ($(this).hasClass('open')) {
                    $(this).removeClass('open');
                    self.Opt.State = 'closed';
                    animate(obj);
                }
                else {
                    if (!self.Opt.MultiOpen) {
                        // find the open drawer, remove the class, move to the next element following it and hide it
                        var prevObj;
                        if (self.Opt.Parent !== '') {
                            prevObj = $(self.Opt.Parent).find('.open');
                        }
                        else {
                            prevObj = $(this).parent().find('.open');
                        }
                        if (prevObj.length > 0) {
                            $(prevObj).removeClass('open');
                            prevObj = prevObj.next();
                            self.Opt.State = 'closed';
                            animate(prevObj);
                        }
                    }
                    // add the open class to this A, move to the next element (i.e UL) and show it
                    $(this).addClass('open');
                    self.Opt.State = 'open';
                    animate(obj);
                }
                return false;
            });
            if (self.Opt.BuildCallBack) {
                self.Opt.BuildCallBack(self.Opt);
            }
        }
    })();
    var openAll = function () {
        self.Opt.State = 'open';
        $(self.Opt.Selector).addClass('open');
        var obj = $(self.Opt.Selector).next();
        animate(obj);
    };
    this.OpenAll = openAll;
    var closeAll = function () {
        self.Opt.State = 'closed';
        $(self.Opt.Selector).removeClass('open');
        var obj = $(self.Opt.Selector).next();
        animate(obj);
    };
    this.CloseAll = closeAll;
};
interact.accordion.opt = function (options) {
    'use strict';
    options && options.wrapper ? this.Wrap = options.wrapper : this.Wrap = '.accordionWrapper';
    options && options.selector ? this.Selector = options.selector : this.Selector = '.accordion';
    options && options.start ? this.Start = options.start : this.Start = 'closed';
    options && options.speedMod ? this.SpeedMod = options.speedMod : this.SpeedMod = 1;
    options && options.parent ? this.Parent = options.parent : this.Parent = '';
    options && options.buildCallBack ? this.BuildCallBack = options.buildCallBack : this.BuildCallBack = '';
    options && options.openCallBack ? this.OpenCallBack = options.openCallBack : this.OpenCallBack = '';
    options && options.closeCallBack ? this.CloseCallBack = options.closeCallBack : this.CloseCallBack = '';
    options && options.multiOpen ? this.MultiOpen = options.multiOpen : this.MultiOpen = false;
};
// TABS
interact.tabs = function (options) {
    'use strict';
    var self = this;
    self.Opt = new interact.tabs.opt(options);
    var animate = function (obj, tab) {
        switch (self.Opt.Transition) {
            case 'none':
                $(obj).hide(0, function () {
                    bindTabEvents();
                    $(this).removeClass(self.Opt.CurrentTabClass);
                    tab.addClass(self.Opt.CurrentTabClass).show(0);
                    if (self.Opt.ChangeCallBack) {
                        self.Opt.ChangeCallBack(self.Opt);
                    }
                });
                break;
            case 'fade':
                $(obj).fadeOut(self.Opt.TransitionSpeed, function () {
                    bindTabEvents();
                    $(this).removeClass(self.Opt.CurrentTabClass);
                    tab.addClass(self.Opt.CurrentTabClass).fadeIn(self.Opt.TransitionSpeed);
                    if (self.Opt.ChangeCallBack) {
                        self.Opt.ChangeCallBack(self.Opt);
                    }
                });
                break;
            case 'slide':
                $(obj).slideUp(self.Opt.TransitionSpeed, function () {
                    bindTabEvents();
                    $(this).removeClass(self.Opt.CurrentTabClass);
                    tab.addClass(self.Opt.CurrentTabClass).slideDown(self.Opt.TransitionSpeed);
                    if (self.Opt.ChangeCallBack) {
                        self.Opt.ChangeCallBack(self.Opt);
                    }
                });
        }
        if (self.Opt.AddHashValue) {
            if ($(self.Opt.TabsContainer + '>:nth-child(' + tab + ')').attr('id')) {
                window.location.hash = 'tab-' + $(self.Opt.TabsContainer + '>:nth-child(' + tab + ')').attr('id');
            }
        }
    };
    var bindTabEvents = function () {
        $(self.Opt.TabsContainer).children().off('click.tab').off('click.blank').on('click.tab', function () {
            $(self.Opt.TabsContainer).children().off('click.tab');
            $(self.Opt.TabsContainer).children().on('click.blank', function () {
                return false;
            });
            $(this).siblings().removeClass(self.Opt.SelectedTabClass);
            $(this).addClass(self.Opt.SelectedTabClass);
            var tabIndex = $(self.Opt.TabsContainer).children().index($(this)) + 1;
            var tab = $(self.Opt.TabContentContainer + '>:nth-child(' + tabIndex + ')');
            animate($(self.Opt.TabContentContainer).children(' .' + self.Opt.CurrentTabClass), tab);
            return false;
        });
    };
    var setTabState = function (reset) {
        // hide all tab's content and only show the selected tab
        $(self.Opt.TabContentContainer).children().hide();
        if (reset) {
            $(self.Opt.TabsContainer).children().removeClass(self.Opt.SelectedTabClass);
        }
        // if no tab has been set as selected in the markup, look to see if a hash value has been set in the URL and use this, otherwise assume it is the first tab
        if (!$(self.Opt.TabsContainer).children().hasClass(self.Opt.SelectedTabClass)) {
            $(self.Opt.TabsContainer + '>:first-child').addClass(self.Opt.SelectedTabClass);
            if (self.Opt.AddHashValue && window.location.hash) {
                var tabToSelect = window.location.hash.split('-');
                $.each($(self.Opt.TabsContainer).children(), function () {
                    if ($(this).attr('id') === tabToSelect[1]) {
                        $(this).siblings().removeClass(self.Opt.SelectedTabClass);
                        $(this).addClass(self.Opt.SelectedTabClass);
                    }
                });
            }
        }
        var selected = $(self.Opt.TabsContainer + ' .' + self.Opt.SelectedTabClass).index() + 1;
        $(self.Opt.TabContentContainer + '>:nth-child(' + selected + ')').addClass(self.Opt.CurrentTabClass).show();
    };
    this.SetTabState = setTabState;
    var init = (function () {
        for (var i = 0; i < $(self.Opt.Wrap).length; i++) {
            var id;
            if ($(self.Opt.Wrap).eq(i).attr('id')) {
                id = $(self.Opt.Wrap).eq(i).attr('id');
            }
            else {
                id = 'tabs_' + i;
                $(self.Opt.Wrap).eq(i).attr('id', id);
            }
            self.Opt.TabsContainer = '#' + id + ' ' + self.Opt.TabsContainer;
            self.Opt.TabContentContainer = '#' + id + ' ' + self.Opt.TabContentContainer;           
            setTabState();
            // change the displayed content when a tab is clicked on
            bindTabEvents();
            if (self.Opt.BuildCallBack) {
                self.Opt.BuildCallBack(self.Opt);
            }
        }
    })();
};
interact.tabs.opt = function (options) {
    'use strict';
    options && options.wrapper ? this.Wrap = options.wrapper : this.Wrap = '.tabsWrapper';
    options && options.tabsContainer ? this.TabsContainer = options.tabsContainer : this.TabsContainer = '.tabs';
    options && options.tabContentContainer ? this.TabContentContainer = options.tabContentContainer : this.TabContentContainer = '.tabContent';
    options && options.selectedTabClass ? this.SelectedTabClass = options.selectedTabClass : this.SelectedTabClass = 'selectedTab';
    options && options.currentTabClass ? this.CurrentTabClass = options.currentTabClass : this.CurrentTabClass = 'currentTab';
    options && options.transition ? this.Transition = options.transition : this.Transition = 'none';
    options && options.transitionSpeed ? this.TransitionSpeed = options.transitionSpeed : this.TransitionSpeed = 500;
    options && options.addHashValue ? this.AddHashValue = options.addHashValue : this.AddHashValue = false;
    options && options.buildCallBack ? this.BuildCallBack = options.buildCallBack : this.BuildCallBack = '';
    options && options.changeCallBack ? this.ChangeCallBack = options.changeCallBack : this.ChangeCallBack = '';
};
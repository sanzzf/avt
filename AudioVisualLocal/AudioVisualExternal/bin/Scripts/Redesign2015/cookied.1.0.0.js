var cookied = function (options) {
	var instance = this;
    instance.Options = new cookied.opt();
	//cookie functions
	function setCookie(c_name,value,exdays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toUTCString()) + "; path=/";
		document.cookie = c_name + "=" + c_value;
	}
	function getCookie(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++) {
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name) {
				return unescape(y);
			}
		}
	}
	function init() {
		var cookieElement = '<div class="cookiedOuter"><div class="cookied">' + instance.Options.message + ' <a href="' + instance.Options.cookiePolicyLink + '">' + instance.Options.cookiePolicyLinkText + '</a> <a href="#" class="cookiedOK">Close</a></div></div>';
		var cookieOK = getCookie("cookieOK");
		if ((cookieOK == null) || (cookieOK == "")) {
			$('body').prepend(cookieElement);
            switch (instance.Options.position) {
				case 'top':
					$('.cookied').css('top', '0');
				break;
				case 'bottom':
					$('.cookied').css('bottom', '0');
                break;
                case 'widget':
                    $('.cookied').addClass('cookiedWidget');
			}
			$('.cookied').fadeIn();
			$('.cookied a.cookiedOK').click(function() {
				setCookie('cookieOK',cookieOK,365);
				$('.cookied').fadeOut();
				return false;
			});
		}
    };
    this.Init = init;
};
cookied.opt = function () {
    this.position = 'top';
	this.message = 'This site uses cookies.';
	this.cookiePolicyLink = '';
	this.cookiePolicyLinkText = 'Please read our cookie policy.';
}
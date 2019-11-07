// jc://design/cookie
//---------------------------------------------------------
// class to set and read cookies
// based on: https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript#24103596
//---------------------------------------------------------


function jcCookie(app,expire=1) {

	this.appName 		= app;
	this.appVersion		= "v0.1";
	this.cookieExpire	= expire*24*60*60*1000; // default = 1 day

	// set cookie for name with value and expiry time
	this.set = function(name,value) {
		var expires;
		if (this.cookieExpire) {
		        var date = new Date();
        		date.setTime(date.getTime() + this.cookieExpire);
		        expires = "; expires=" + date.toUTCString();
			}
		document.cookie = this.appName + "_" + name + "=" + (value || "")  + expires + "; path=/";
		}

	// get value from cookie for name
	this.get = function(name) {
		var nameEQ	= this.appName + "_" + name + "=";
		var ca 		= document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    			}
		return null;
		}

	// erase value for cookie name
	this.erase = function(name) {
		document.cookie = this.appName + "_" + name+'=; Max-Age=-99999999;';
		}
	}


//---------------------------------------------------------
// EOF

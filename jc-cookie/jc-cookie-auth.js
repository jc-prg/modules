// jc://design/cookie/authorize
//---------------------------------------------------------
// authorization ... store / edit password in cookie (pwd check done server side)
//---------------------------------------------------------
// requires jc://design/cookie loaded
// requires jc://design/message loaded
// requires css ...
// requires jquery-2.1.3.js loaded
// requires <div id="{app_name}"></div> in HTML-Code
//---------------------------------------------------------
// BACKLOG
// ---
// IDEA - load css-files dynamically via js-file
// IDEA - check if only one app version is loaded
//---------------------------------------------------------


function jcAuth(app_name) {

	this.appName 	= app_name;
	this.appVersion	= "v0.2";
	this.appTarget	= app_name;

	this.authCookie = "pwd"; 			// name for cookie
	this.authPwd	= "";    			// default no password is set
	this.authStatus = "Nicht angemeldet";		// default info no password is set
	this.authImgEye = "/apps/jc-app/img/eye.png";	// eye image to show/hide password

	// create dialog incl. hot keys
	//------------------------------------
	this.init = function() {

		// create dialog framework
		var showLogin		 = "<div id=\"" + this.appName + "_status\" class=\"authData\" onclick=\"" + this.appName + ".editPwd();\"></div>";
		showLogin		+= "<input id=\"" + this.appName + "_input_pwd\" style=\"display:none;\" value=\"\">";
		showLogin		+= "<div id=\"" + this.appName + "_cookie_msg\" class=\"authDialog\"><!-- Container for messages --></div>";

		// create dialog to edit password
		var showEditDialog	 = "<div id=\"" + this.appName + "_edit\">";
		showEditDialog		+= "<b>Bitte Passwort hinterlegen</b><br/>&nbsp;<br/>";
		showEditDialog	 	+= 	"<div   id=\"" + this.appName + "_input\">Passwort: &nbsp;";
		showEditDialog	 	+= 	"<input id=\"" + this.appName + "_input_pwd_edit\" type=\"password\" class=\"authInputPwd\">";
		showEditDialog	 	+= 	"<img src=\"" + this.authImgEye + "\" class=\"authEye\" onclick=\"" + this.appName + ".showPwdInput();\" style=\"z-index:1\">";
		showEditDialog	 	+= 	"<button onclick=\"document.getElementById('" + this.appName + "_input_pwd_edit').value='';\" class=\"authEmptyButton\">x</button>";
		showEditDialog		+=	"</div>";
		showEditDialog		+= "</div>";

		// write framework & save dialog to var
		this.setTextById(this.appTarget,showLogin);
		this.editDialog = showEditDialog;

		// password set in cookie, save in page
		if (this.authPwd) {
			document.getElementById(this.appName + "_input_pwd").value = this.authPwd;
			}

		// create apps for cookie handling and message
		this.cookie	= new jcCookie( this.appName + "_cookie", 1 );
		this.message    = new jcMsg( this.appName + "_cookie_msg", this.appName + ".message" ); // parent not yet in place

		// get password from cookie
		this.authPwd = this.cookie.get(this.authCookie);
		document.getElementById(this.appName + "_input_pwd").value = this.authPwd;

		// Write Login Status
		this.status();
		}

	// show status in field (no password check)
	//------------------------------------
	this.status = function() {
		if (this.authPwd != "" && this.authPwd != null)	{ this.setTextById( this.appName + "_status", "Passwort hinterlegt" ); }
		else 						{ this.setTextById( this.appName + "_status", "Nicht angemeldet" ); }
		}

		// open dialog to edit the password
	//------------------------------------
	this.editPwd = function() {
		var app = this;

		this.authPwd = document.getElementById(this.appName + "_input_pwd").value;    //alert("Test: " + authPwd );
		this.cookie.set(this.authCookie,this.authPwd);

		this.status();
		this.message.confirm(this.editDialog,this.appName+".setPwd(true);",170);
		document.getElementById(this.appName + "_input_pwd_edit").value = this.authPwd; // add existing password to input field
		}

	// save password 2 cookie & password var
	//------------------------------------
	this.setPwd = function(from_edit_field=false) {

		// get value from edit field
		if (from_edit_field) {
			document.getElementById(this.appName + "_input_pwd").value = document.getElementById(this.appName + "_input_pwd_edit").value;
			}

		// set var and cookie
		this.authPwd = document.getElementById(this.appName + "_input_pwd").value; //alert(this.authPwd);
		this.cookie.set(this.authCookie,this.authPwd);

		// Write Login Status
		this.status();
		}

	// return set password
	//------------------------------------
	this.getPwd = function() {
		return this.authPwd;
		}

	// show set password
	//------------------------------------
	this.showPwd = function() {
		this.message.alert(this.authPwd);
		}

	// show cookie
	//------------------------------------
	this.showCookie = function() {
		var cookie = this.cookie.get(this.authCookie);
		this.message.alert(this.appName+"_"+this.authCookie+"="+cookie);
		}

	// show password in input field
	//------------------------------------
	this.showPwdInput = function() {
        	var element = document.getElementById(this.appName + "_input_pwd_edit");
	        if (element.type == 'text') 	{ element.type = "password"; }
        	else 				{ element.type = "text"; }
		}

	// fill text into div element
	//------------------------------------
	this.setTextById = function(id,text) {
		document.getElementById(id).innerHTML = text;
		}
	}

module_scripts_loaded += 1;

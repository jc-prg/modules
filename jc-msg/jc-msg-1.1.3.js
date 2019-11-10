
// jc://design/
//-------------------------------------------------------
// write messages (instead of Alert, Confirmed, Waiting ...)

function jcMsg(app_name,app_link="") {

	this.appName     = app_name;
	this.appLink     = app_name;
	if (app_link != "") { this.appLink = app_link; }

	this.appVersion  = "v1.1.3";

	if (document.getElementById(this.appName)) {
		document.getElementById(this.appName).innerHTML +=
		'<div id="' + app_name + '_cover"   class="jcMsgCover">' +
		'<div id="' + app_name + '_body"    class="jcMsgBody">' +
		'<div id="' + app_name + '_text"    class="jcMsgText"></div>' +
		'<div id="' + app_name + '_buttons" class="jcMsgButtons"></div></div></div>';
		}
	else {	console.log( "Error " + this.appName + " (jcMsg " + this.appVersion + "): no element name like app");
		}

	this.cover       = document.getElementById(app_name+"_cover");
	this.body        = document.getElementById(app_name+"_body");
	this.text        = document.getElementById(app_name+"_text");
	this.buttons     = document.getElementById(app_name+"_buttons");
	this.loop        = false;

	console.log( "Start " + this.appName + " (jcMsg " + this.appVersion + ")");

	// small message wait ...
	//-----------------------------
	this.wait_small = function (text="", callback="", callback_label="") {
		this.show();

		var message = "";
		message += "<table border='0' style='width:100%'><tr><td valign='top'><br/>";
		message += text;
		message += "</td><td style='width:100px'>";
		message += "<img src='apps/jc-msg/img/waiting2.gif' style='height:100px;width:100px;'>";
		message += "</td></tr></table>";

		this.body.style.backgroundSize     = "100px";
		this.body.style.height		   = "130px";
		this.text.style.height		   = "75px";
		this.text.style.top                = "10px";
		this.text.innerHTML                = message;

		this.buttons.style.top             = "10px";
		var buttons			   = "<center><button class='jcMsgButton' onClick='" + this.appName +".hide();'>close</button>";
		if (callback != "") { buttons     += " <button class='jcMsgButton' onClick='" + callback +"'>"+callback_label+"</button></center>"; }
		//this.buttons.style.right           = "50px";
		this.buttons.innerHTML             = buttons;
		}

	// big message wait ...
	//-----------------------------
	this.wait = function (text="", callback="") {
		this.show();
		this.body.style.backgroundImage    = "url('apps/jc-msg/img/waiting.gif')";
		this.body.style.backgroundRepeat   = "no-repeat";
		this.body.style.backgroundPosition = "center";
		this.body.style.backgroundSize     = "100px";
		this.body.style.height		   = "250px";
		this.text.style.height		   = "185px";
		this.text.style.top                = "5px";
		this.text.innerHTML                = "<center><b><br/>" + text + "</b></center>";
		this.buttons.style.top             = "10px";
		var buttons			   = "<center><button class='jcMsgButton' onClick='" + this.appLink +".hide();'>dont wait</button>";
		if (callback != "") { buttons     += " <button class='jcMsgButton' onClick='" + callback +"'>reload</button></center>"; }
		this.buttons.innerHTML             = buttons;
		}

	// alert message (OK button)
	//-----------------------------
	this.alert = function (msg="") {
		this.body.style.height		   = "140px";
		this.text.style.height             = "70px";
		this.text.style.top                = "5px";
		this.text.innerHTML                = "<center><br/>" + msg + "</center>";
		this.buttons.style.top             = "20px";
		this.buttons.innerHTML             =  "<center><button class='jcMsgButton' onClick='" + this.appLink +".hide();'>OK</button> ";
		this.show();
		}

	// alert return message (API)
	//-----------------------------
	this.alertReturn = function (data) {
        	msg = data["ReturnMsg"];
        	this.alert(msg);
        	}

	// confirm message
	//-----------------------------
	this.confirm = function (msg, cmd="", height="120", close=true) {


		if (cmd!="") { cmd = cmd.replace(/##/g,"''"); }
		if (cmd!="") { cmd = cmd.replace(/#/g,"'"); }

		var hh = height-60; //height - 120;

		this.body.style.height		   = height+"px";
		this.body.style.top                = "100px";
		this.text.style.top                = "0px";
		this.text.style.height             = hh+"px";
		this.text.innerHTML                = "<center><br/>" + msg + "</center>";
		this.buttons.style.top             = "20px";

		var hideCmd = "";
		if (close) { hideCmd = this.appLink +".hide();"; }
		else       { console.log("Hide dialog with cmd "+this.appLink +".hide();"); }

		var buttons                = "<center>";
		if (cmd != "") { buttons  += "<button id=\"" + this.appName + "_ok\" class='jcMsgButton' onClick=\"" + cmd + ";" + hideCmd +"\">OK</button>&nbsp; &nbsp;";	}
		buttons                   += "<button id=\"" + this.appName + "_chancel\" class='jcMsgButton' onClick=\"" + this.appLink +".hide();\">Cancel</button></center>";

		this.buttons.innerHTML             = buttons;

		//---------------------------------------
		// Set Hot Keys ==> move to messages

		var app = this;
		document.onkeyup = function(event) {
			if (app.cover.style.display == "block") {
				if (event.which === 13) { document.getElementById(app.appName +"_ok").click(); } // enter
				if (event.which === 27) { document.getElementById(app.appName +"_chancel").click(); } // escape
				}
			};

		//---------------------------------------

		this.show();
		}

	// dialog
	//-----------------------------

	this.dialog = function() {
		}


	// show message
	//-----------------------------
	this.show = function () {
		this.cover.style.display = "block";
		}

	// hide message
	//-----------------------------
	this.hide = function () {
		this.cover.style.display = "none";
		this.body.style.backgroundImage = "";
		}

	}

//---------------------------------
// execute command if confirmed
//--------------------------------

function ifconfirmed(question,funct,param,callback="") {

        // create command incl. parameters
        var cmd  = funct + "(";
        for (var i=0; i<param.length; i++ ) {
                cmd += "'" + param[i] + "'";
                if (i<param.length) { cmd += ","; }
                }
        cmd += ");";

	// callback function if defined
	if (callback!="") { callback(); }
        }

// EOF

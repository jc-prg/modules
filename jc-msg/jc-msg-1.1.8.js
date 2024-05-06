// jc://msg/
//-------------------------------------------------------
// write messages (instead of Alert, Confirmed, Waiting ...)
//-------------------------------------------------------

function jcMsg(app_name,app_link="") {

	this.appName     = app_name;
	this.appLink     = app_name;
	this.appVersion  = "v1.1.8";
	
	this.waiting_img    = ["modules/jc-msg/waiting.gif","modules/jc-msg/waiting2.gif"];
	this.default_height = 250;
	this.default_width  = 500;
	
	if (app_link != "") { this.appLink = app_link; }

	if (document.getElementById(this.appName)) {
		document.getElementById(this.appName).innerHTML +=
		'<div id="' + app_name + '_cover"   class="jcMsgCover">' +
		'<div id="' + app_name + '_body"    class="jcMsgBody">' +
		'<div id="' + app_name + '_text"    class="jcMsgText" ></div>' + //style="border:1px solid #eeeeee;"></div>' +
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


	// configure
	//-----------------------------
	
	this.set_waiting_image = function(image_url) {
		this.waiting_img    = [image_url];
		}

	// position message
	//-----------------------------

	this.message_top	= function(height) {
	        var top = ((window.innerHeight - height) / 2) - 10; 
	        if (top < 10) { top = 10; }
		return top;
		}
		
	this.message_width	= function(width) {
		if (width > window.innerWidth - 60) { return window.innerWidth - 60; }
		else                                { return width; }
		}
		
	this.message_height	= function(height) {
		if (height > window.innerHeight - 80) { return window.innerHeight - 80; }
		else                                  { return height; }
		}
	this.message_height_txt = function(height) {
		var top_button = 70;
		if (height > window.innerHeight - 80) { return window.innerHeight - 80 - top_button; }
		else                                  { return height - 50; }	
		}

	// small message wait ...
	//-----------------------------
	this.wait_small = function (text="", callback="", callback_label="") {
		this.show();

		var height  = 160;
		var message = "";
		message += "<table border='0' style='width:100%'><tr><td valign='top'><br/>";
		message += text;
		message += "</td><td style='width:100px'><br/>";
		message += "<img src='"+this.waiting_img[0]+"' style='height:80px;width:80px;' class='jcMsgImg'>";
		message += "</td></tr></table>";

		this.body.style.backgroundSize     = "100%";
		this.body.style.width              = this.message_width(this.default_width)+"px";
		this.body.style.height             = this.message_height(height)+"px";
		this.body.style.top                = this.message_top(height)+"px";
		
		this.text.style.top                = "10px";
		this.text.style.width              = (this.message_width(this.default_width)-20)+"px";
		this.text.style.maxWidth           = (this.message_width(this.default_width)-20)+"px";
		this.text.style.height             = this.message_height_txt(height)+"px";
		this.text.style.maxHeight          = this.message_height_txt(height)+"px";
		this.text.innerHTML                = message;

		this.buttons.style.top             = "10px";
		var buttons                        = "<center>";
		var button_default                 = "<button class='jcMsgButton' onClick='" + this.appName +".hide();'>close</button>";
		if (callback != "")                { buttons += button_default + " <button class='jcMsgButton' onClick='" + callback +"'>"+callback_label+"</button></center>"; }
		else if (callback_label != "")     { buttons += "<button class='jcMsgButton' onClick='" + this.appName +".hide();'>"+callback_label+"</button>"; }
		this.buttons.innerHTML             = buttons;
		}

	// wait message and components ...
	//-----------------------------
	this.wait_time = function (text="",time=10) {
		var message  = text;
		message     += "<br/>&nbsp;<br/>"+this.wait_progressbar(time); 
		this.wait_small(message, "", "Cancel");

        var time_start = new Date().getTime() / 1000;
        var time_max   = time_start + time;

		var app = this;
		document.getElementById(app.appName+'_wait_start'). innerHTML = time_start;
		document.getElementById(app.appName+'_wait_max'). innerHTML = time_max;

		var interval = setInterval(function() {
			var progress   = document.getElementById(app.appName+'_wait_progress');
			var time_left  = document.getElementById(app.appName+'_wait_left').innerHTML;
			var time_start = document.getElementById(app.appName+'_wait_start').innerHTML;
			var time_max   = document.getElementById(app.appName+'_wait_max').innerHTML;
			var time_current = new Date().getTime() / 1000;

			time_left      = Math.round(time_max - time_current);
			time_diff      = Math.round(time_current - time_start);
			document.getElementById(app.appName+'_wait_left').innerHTML = time_left;

			var value      = time_diff; // progress.value+1;
			progress.value = value;
			if (time_left < 0) {
			    app.hide();
    			clearInterval(interval);
			    }
			},1000);
			
		setTimeout(function () {
			app.hide();
			clearInterval(interval);
			}, time*1000+1000);
		}

	this.wait_progressbar = function (max=100) {
		var text = "";
		var date = new Date().getTime();
		var show = Math.round(max - date);
		text += '<progress id="' + this.appName + '_wait_progress" value="0" min="0" max="'+max+'" class="jcMsgProgress"></progress>';
		text += '&nbsp;&nbsp;&nbsp;<info id="' + this.appName + '_wait_left">' + max + '</info>&nbsp;s';
		text += '<info id="' + this.appName + '_wait_start" style="display:none">' + date + '</info>';
		text += '<info id="' + this.appName + '_wait_max" style="display:none">' + max + '</info>';
		return text;
		}
		
	this.wait = function (text="", callback="") {
	
		var height = this.default_height;
		
		this.show();
		this.body.style.backgroundImage     = "url('"+this.waiting_img[0]+"')";
		this.body.style.backgroundRepeat    = "no-repeat";
		this.body.style.backgroundPosition  = "50% 60%";
		this.body.style.backgroundSize      = "25%";
		this.body.style.width               = this.message_width(this.default_width)+"px";
		this.body.style.height              = this.message_height(height)+"px";
		this.body.style.top                 = this.message_top(height)+"px";

		this.text.style.top                 = "10px";
		this.text.style.width               = (this.message_width(this.default_width)-20)+"px";
		this.text.style.maxWidth            = (this.message_width(this.default_width)-20)+"px";
		this.text.style.height              = this.message_height_txt(height)+"px";
		this.text.style.maxHeight           = this.message_height_txt(height)+"px";
		this.text.innerHTML                 = "<center><b><br/>" + text + "</b></center>";
		
		this.buttons.style.top          = "10px";
		var buttons                     = "<center><button class='jcMsgButton' onClick='" + this.appLink +".hide();'>dont wait</button>";

		if (callback != "") { buttons  += " <button class='jcMsgButton' onClick='" + callback +"'>reload</button></center>"; }
		this.buttons.innerHTML          = buttons;
		}

	// alert message (OK button)
	//-----------------------------
	this.alert = function (msg="",callback="") {
	
		var height = 140;
	
		this.body.style.width           = this.message_width(this.default_width)+"px";
		this.body.style.height          = this.message_height(height) + "px";
		this.body.style.top             = this.message_top(height) + "px";

		this.text.style.top             = "10px";
		this.text.style.width           = (this.message_width(this.default_width)-20)+"px";
		this.text.style.maxWidth        = (this.message_width(this.default_width)-20)+"px";
		this.text.style.height          = this.message_height_txt(height)+"px";
		this.text.style.maxHeight       = this.message_height_txt(height)+"px";
		this.text.innerHTML             = "<center><br/>" + msg + "</center>";

		if (callback != "")             { callback_cmd = callback + "();"; }
		else                            { callback_cmd = ""; }
		
		this.buttons.style.top          = "10px";
		this.buttons.innerHTML          =  "<center><button class='jcMsgButton' onClick='" + this.appLink +".hide();"+callback_cmd+"'>OK</button> ";
		this.show();
		}

	// alert return message (API)
	//-----------------------------
	this.alertReturn = function (data, callback="") {
	        if (data["ReturnMsg"]) 		{ msg = data["ReturnMsg"]; }          // older apps
	        if (data["REQUEST"]["Return"])	{ msg = data["REQUEST"]["Return"]; }  // newer apps
        	this.alert(msg,callback);
        	}

	// confirm message
	//-----------------------------
	this.confirm = function (msg, cmd="", height="", close=true) {

		if (height=="") { height = this.default_height; }
		if (cmd!="")    { cmd = cmd.replace(/##/g,"''"); }
		if (cmd!="")    { cmd = cmd.replace(/#/g,"'"); }

		var hh = height-60; //height - 120;

		this.body.style.width       = this.message_width(this.default_width);
		this.body.style.height      = this.message_height(height)+"px";
		this.body.style.top         = this.message_top(height)+"px";

		this.text.style.top         = "10px";
		this.text.style.height      = this.message_height_txt(height)+"px";
		this.text.style.maxHeight   = this.message_height_txt(height)+"px";
		this.text.style.overflow    = "auto";
		this.text.innerHTML         = "<center><br/>" + msg + "</center>";

		var hideCmd = "";
		if (close) { hideCmd = this.appLink +".hide();"; }
		else       { console.log("Hide dialog with cmd "+this.appLink +".hide();"); }

		var buttons                = "<center>";
		if (cmd != "") { buttons  += "<button id=\"" + this.appName + "_ok\" class='jcMsgButton' onClick=\"" + hideCmd + ";" + cmd +";\">OK</button>&nbsp; &nbsp;";	}
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

	// information messages (left lower corner)
	//-----------------------------


    this.info_messages = {}
    this.info_message_id = 0;
    this.info_overlay = "jc_message_overlay";

    this.info  = function (message) {

        var message_box = document.getElementById(this.info_overlay);
        var timestamp   = Date.now();
        this.info_messages[timestamp] = message;
        }

    this.info_message_check = function () {

        var timestamp        = Date.now();
        var message_box      = document.getElementById(this.info_overlay);
        var messages         = "";
        var message_duration = 10000;
        var message_delete   = [];
        for (var key in info_messages) {
            if (Number(key) + message_duration > timestamp) {
                messages += "<div class='jc_message_overlay_box'>"+info_messages[key]+"</div>";
                }
            else                     { message_delete.push(key); }
            }
        setTextById(this.info_overlay, messages);
        for (var i=0;i<message_delete.length;i++) {
            delete this.info_messages[message_delete[i]];
            }
        }

    this.info_message_init = function (message_handler) {

        var info_container = document.createElement("div");
        info_container.id = this.info_overlay;
        info_container.classList.add("jc_message_overlay");
        document.querySelector('body').appendChild(info_container);

        this.info_message_id = setInterval(function() { message_handler.info_message_check(); }, 500);
        }

    this.info_message_stop = function () {
        // not implemented yet
        }


	// show message
	//-----------------------------
	this.show = function (param="") {
		this.cover.style.display = "block";
		}

	// hide message
	//-----------------------------
	this.hide = function (param="") {
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

module_scripts_loaded += 1;

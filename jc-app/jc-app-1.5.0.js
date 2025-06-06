// jcApp - REST API Interaction Framework
//==============================================================================
// USAGE:
//
// var myApp   = new jcApp( "myApp", RESTurl, "remote/list/", "remoteSend/");     // cmd: <device>/<cmd>
// myApp.init( "data_log", "error_log", reloadInterval, printAppStatus );
// myApp.loadWhenSend = true;
// myApp.callback     = true;	// sendCmd -> use 2nd param as callback function (if exist)
// myApp.load();                // initial load
// myApp.setAutoupdate();	    // use to start interval
// myApp.requestAPI_init();	    // use if you want to use a queue
//
// function printAppStatus(data) {
//	document.write(data[]);
//	}
//
//------------------------------------------------------


var jcAppTest    = true;


function jcApp( name, url, list_cmd, send_cmd ) {

	this.appName          = name;
	this.appVersion       = "v1.5.0";
	this.appStatField     = name + "_status";
	this.appUrl           = url;
	this.appList          = list_cmd;
	this.appSend          = send_cmd;
	this.accepted_methods = ["GET","POST","DELETE","PUSH","PATCH","PUT"];

	this.appData          = {};		// data, got by load
	this.appSendData      = {};		// data, got by last used command
	this.appHideError     = false;		// if error log should not be shown automaticly, set true

	this.appUpdate        = -1;
	this.appUpdateTemp    = 1;
	this.appUpdateCurrent = -1;
	this.appIntervalMain  = -1;
	this.appIntervalCall  = -1;
	this.appIntervalTemp  = -1; // -1 -> enable temp interval -> this.appUpdateTemp in seconds

	this.errorList       = [];
	this.errorCount      = 50;
	this.loadWhenSend    = false;
	this.async           = true;
	this.lastConnect     = 0;
	this.maxTimeout      = 15000;  	// set to -1 for no timeout
	this.timeout         = -1;
	this.error_timeout   = false;
	this.average_times   = {};

	this.queue           = [];
	this.use_queue       = false;
	this.execute         = false;
	this.queue_interval  = 500;

	// add container for data & error messages (if <body id="this.appName">)
	if (document.getElementById(this.appName)) {
		document.getElementById(this.appName).innerHTML +=
		"<div id='" + this.appName + "_data'></div>" +
		"<div id='" + this.appName + "_error' class='jc_error_log'></div>" +
		"<div id='" + this.appName + "_msg'></div>";
		}
	else { console.log("test3: "+this.appName); }

	console.log("Start " + this.appName + " (jcApp " + this.appVersion + ")");

	// set central parameters
	this.init = function( data_container, error_container, update_interval, printFunction, printRequest ) {

		if (data_container!="")     { this.appTarget    = data_container; }			// html element for app content (if required)
		else                        { this.appTarget    = this.appName + "_data"; }
		if (error_container!="")    { this.appError     = error_container; } 		// html element for error messages (additionally console messages are generated)
		else                        { this.appError     = this.appName + "_error"; }

		if (jcAppTest) { console.log("Container: "+this.appTarget+"/"+this.appError); }

		this.appUpdate          = update_interval;	// interval for reload;
		this.appUpdateCurrent   = this.appUpdate;

		this.printFunction = printFunction;	// callback for this.load();
		this.printRequest  = printRequest;


		var show_error2 = "";
		var show_error  = " onClick=\"javascript:"+this.appName+".errorLogShow();\" ";
		this.linkError  = "&nbsp;&nbsp;<span "+show_error+" style=\"cursor: pointer;\" id=\"errorLink_"+this.appName+"\"><i>e</i></span>";

		this.green  = "<div id='jc_green' "  +show_error2+ "></div>";
		this.gray   = "<div id='jc_gray' "   +show_error2+ "></div>";
		this.red    = "<div id='jc_red' "    +show_error2+ "></div>";
		this.yellow = "<div id='jc_yellow' " +show_error2+ "></div>";
		this.lastConnect = this.time();

		if (jcAppTest) { console.log(name + ": Initialize App"); }
        this.setStatus("waiting");

		if (document.getElementById(this.appTarget)) {
		   if (document.getElementById(this.appTarget).innerHTML == "") {
			this.waiting = "&nbsp;<br/><b>" + this.appName + "</b><br/>jcApp " + this.appVersion + "<br/>&nbsp;<br/><img src='/apps/jc-app/img/waiting.gif' style='height:50px;width:50px;'>";
			this.waiting = "<div style='background:white;height:200px;'>" + this.waiting + "</div>";
			this.setTextById(this.appTarget, this.waiting);
			}}
		}

	// write error log
	this.errorLog = function(new_msg, start_time="", request_url="DEFAULT") {

		var msg   = document.getElementById(this.appError).innerHTML;
		var stamp = new Date();
		var time  = stamp.toLocaleTimeString();

		this.errorList = this.errorGetLog();

		if (start_time) {
			duration = (stamp.getTime() - start_time) / 1000;
			this.errorList.unshift(time + ": " + new_msg + " (" + duration + "s)");

			var url_parts = request_url.split("/");
	        if (/^\d+$/.test(url_parts[1])) { request_url = request_url.replace("/" + url_parts[1],""); }

			if (!this.average_times[request_url]) {
			    this.average_times[request_url] = [duration];
			    }
			else {
			    this.average_times[request_url].push(duration);
			    if (this.average_times[request_url].length > 20) { this.average_times[request_url].shift(); }
			    }

			}
		else {
			this.errorList.unshift(time + ": " + new_msg);
			}
		if (this.errorList.length > this.errorCount) { this.errorList.pop(); }		 // delete old messages if maximum reached

		if (new_msg.indexOf("Error") >= 0)	{ console.error( new_msg ); }
		else if (jcAppTest) 			{ console.debug( new_msg ); }


		var app = this;
		if ((new_msg.indexOf("Error") >= 0) && document.getElementById("errorLink_"+app.appName) ) {
			document.getElementById("errorLink_"+app.appName).style.color = "black";
			document.getElementById("errorLink_"+app.appName).innerHTML = "!";
			document.getElementById("errorLink_"+app.appName).style.textShadow = "red 0.2em 0.2em 0.2em";
			setTimeout(function(){
			document.getElementById("errorLink_"+app.appName).style.color = "white";
			document.getElementById("errorLink_"+app.appName).style.textShadow = "";
			}, 3000);
			}

		var msg = "";
		for (var i=0;i<this.errorList.length;i++) {
			msg += this.errorList[i] + "<br/>";
			}

		this.setTextById(this.appError, msg);
		// Idee: id="errorLink_"+this.appName => rot aufleuchten lassen, wenn Fehler gemeldet wird
		}

	// read existing log
    this.errorGetLog = function () {
		log = document.getElementById(this.appError).innerHTML;
		return log.split("<br/>");
		}

	// show / hide error log
	this.errorLogShow = function() {
		id = this.appError;
		if (this.IsHidden(id)) { this.elementVisible(id); }
		else                   { this.elementHidden(id); }
		}

    // get average request durations
	this.getAverageRequestDurations = function(value="all") {
	    var answer = {};
	    if (value == "all") {
	        Object.keys(this.average_times).forEach(key => {
	            var sum = this.average_times[key].reduce((acc, val) => acc + val, 0);
	            answer[key] = sum / this.average_times[key].length;
	            });
	        }
	    else if (this.average_times[value]) {
	        var sum = this.average_times[value].reduce((acc, val) => acc + val, 0);
            answer = sum / this.average_times[key].length;
            }
        else {
            answer = -1;
            }
	    return answer;
	    }

	// get time
	this.time = function() {
		var old = this.lastConnect;
		var d   = new Date();
		this.lastConnect = d.getTime();

		//console.log(old+"/"+this.lastConnect+"/"+(this.lastConnect-old));
		}

	// set timeout
	this.setTimeout	= function(timeout=-1) {

		this.timeout = timeout;
		}

	// load data from REST API
	this.load = function(source="") {
        var app  = this;
        app.setStatus("waiting");
        app.requestAPI("GET",[app.appList],"", app.printFunction,"",source);
        return;
        }

	// start queue
	this.requestAPI_init = function() {
		this.use_queue = true;
		if (this.timeout == -1 && this.maxTimeout != -1) { this.timeout = this.maxTimeout; }
		jcAppInterval  = this;
		setInterval(function(){ jcAppInterval.requestAPI_queue(); }, this.queue_interval);
		}

	// add to queue
	this.requestAPI = function( method, cmd, body_data, callback_array="", wait_till_executed="", source="") {
        this.printRequest("START", cmd, source);
		if (this.use_queue) { this.queue.push( [ method, cmd, body_data, callback_array, wait_till_executed, source ] ); }
		else                { this.requestAPI_execute( method, cmd, body_data, callback_array, wait_till_executed, source ); }
		}

	// execute from queue
	this.requestAPI_queue = function() {
		if (this.queue.length > 0) {
			//if (this.queue.length > 1 && this.queue[0] == this.queue[1]) { this.queue.shift(); }
			[ method, cmd, body_data, callback_array, wait_till_executed, source ] = this.queue[0];
			this.queue.shift();
			this.execute = true;
			this.requestAPI_execute( method, cmd, body_data, callback_array, wait_till_executed, source );
			}
		}

	// send cmd to rest API
	this.requestAPI_execute = function( method, cmd, body_data, callback_array="", wait_till_executed="", source="") {

		var callback;
		var app  	 	    = this;
		var start_time	 	= new Date();
		var transfer_cmd 	= "";
		this.error_timeout  = false;

		if (Array.isArray(callback_array))      { callback = callback_array[0]; callback_param = callback_array[1]; }
		else                                    { callback = callback_array;    callback_param = "";}

		// create request URL
		var requestURL	 	 = this.appUrl + this.appSend + encodeURI(cmd[0]);
		var requestURL_param = "/" + encodeURI(cmd[0]);
		for (var i=1;i<cmd.length;i++) {
			if (cmd[i]) { requestURL       += "/" + encodeURI(cmd[i]); }
			if (cmd[i]) { requestURL_param += "/" + encodeURI(cmd[i]); }
			transfer_cmd += cmd[i] + "_";
			}
		requestURL += "/";

		// check if method supported
		if (this.accepted_methods.indexOf(method)<0) { console.error( this.appName + ": RequestAPI - ERROR, method not allowed ("+method+"/"+source+")." ); return; }

		// asynchronous transfers per default, synchronous transfer if requested
		var asyncronous = true;
		if (wait_till_executed == "wait") {
			console.debug("Synchronous transfer used for request: " + requestURL);
			asyncronous = false;
			}

		if (jcAppTest) { console.debug( "Request: " + this.appName + " - " + method + " / " + requestURL + " ("+source+")"); }

		// start request
		var xhttp = new XMLHttpRequest();
		xhttp.open( method, requestURL, asyncronous );
		xhttp.onreadystatechange = function () { // see status ...
            if (xhttp.readyState > 3 && xhttp.status>=200 && xhttp.status<300) {
				// success
				// .readyState -> 0: request not initialized; 1: server connection established; 2: request received; 3: processing request; 4: request finished and response is ready
				// .status -> http return codes 2xx OK, 3xx redirect, 4xx client error, 5xx server error
				var data = JSON.parse(xhttp.responseText);

                if (data != null)   { console.debug(app.appName + " " + method + ": " + requestURL + " - OK"); }
                else                { console.error("No data returned: " + app.appName + " " + method + ": " + requestURL); data = {}; }

                app.errorLog( 'Success: ' + app.appName + ' - <a href=\"' + requestURL + '\" target=\"_blank\">' + requestURL + '</a> (' + xhttp.status + ').',start_time, requestURL_param);
				app.setStatus('running');
				app.time();
				app.appSendData = data;

				var m = new Date();
				if (!data["REQUEST"]) { data["REQUEST"] = {}; }
				data["REQUEST"]["load-time-app"] = m-start_time;
				data["REQUEST"]["request-url"]   = requestURL;
				data["REQUEST"]["request-type"]  = method;

				if (app.appErrorHide == false) 	app.elementVisible(app.appTarget);
				if (app.appErrorHide == false) 	app.elementHidden(app.appError);
				if (app.loadWhenSend) 			app.load("loadWhenSend");

				if (callback != "") {
					if (callback_param != "") { callback(data,callback_param); }
					else                      { callback(data); }
					}
				console.debug(app.appName + ": " + requestURL + " - Finished");

				app.printRequest("SUCCESS", cmd, source);
				app.execute = false;
				}
			else if (xhttp.readyState > 3 && xhttp.status>=400) {

				console.debug(app.appName + " " + method + ": " + requestURL + " - ERROR, see error log.");

				// finished (.readyState = 4) but error
				try		{ var data = JSON.parse(xhttp.responseText); }
				catch(e)	{ var data = {}; data["detail"] = xhttp.responseText; }
				app.errorLog('Error: ' + app.appName + ' - ' + method + ' / <a href=\"' + requestURL + '\" target=\"_blank\">' + requestURL + '</a> (not available/' + xhttp.readyState + '/' + xhttp.status + ').', start_time, requestURL_param);
				app.errorLog('Error Detail: ' + data["detail"]);
				app.appSendData = {};
				app.setStatus("error");

				if (app.appErrorHide == false) 	app.elementHidden(app.appTarget);
				if (app.appErrorHide == false) 	app.elementVisible(app.appError);
				if (callback) 				callback({},callback_param);
				app.execute = false;
				app.printRequest("ERROR", cmd, source);
				}
			else {
              			//console.debug( 'Debug: ' + app.appName + ' - ' + requestURL + ' (' + xhttp.status + '/' + xhttp.readyState + ').');
				}
			}

		xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

		// set timeout if defined
		if (this.timeout > -1 && asyncronous) {
			xhttp.ontimeout = function () {
			    xhttp.error_timeout = true;
				console.error("The request for " + requestURL + " timed out: " + xhttp.timeout + "ms / " + cmd + " / " + source );
				app.printRequest("TIMEOUT", cmd, source);
				};
			if (source == "setAutoupdate" && this.appUpdate < this.timeout) { xhttp.timeout = this.appUpdate - 900; }
			else                                                            { xhttp.timeout = this.timeout; }
			}

		if (body_data)  { xhttp.send(JSON.stringify(body_data)); }
		else            { xhttp.send(); }

		/*
		// https://www.w3schools.com/xml/ajax_intro.asp
		// https://en.wikipedia.org/wiki/Ajax_%28programming%29#JavaScript_example
		// https://stackoverflow.com/questions/39519246/make-xmlhttprequest-post-using-json#39519299

		onloadstart*	When the request starts.
		onprogress	While loading and sending data.
		onabort*	When the request has been aborted. For instance, by invoking the abort() method.
		onerror		When the request has failed.
		onload		When the request has successfully completed.
		ontimeout	When the author specified timeout has passed before the request could complete.
		onloadend*	When the request has completed (either in success or failure).

		*/
		}

	// send cmd to rest API - initial => to stay compatible
	this.sendCmd = function( cmd, callback, wait="" ) {
		var data = {};
		this.requestAPI_execute("GET", cmd, data, callback, wait, "sendCmd");
		}

	// send cmd to rest API (synchronous) => to stay compatible
	this.sendCmdSync = function( cmd, callback ) {
		var data = {};
		this.requestAPI_execute("GET", cmd, data, callback, "wait", "sendCmdSync");
		}

	// send cmd to rest API including a password => to stay compatible
	this.sendCmdPwd = function( cmd, pwd, callback ) {
		var data = {};
		cmd.push( pwd );
		this.requestAPI_execute("GET", cmd, data, callback, "", "sendCmdPwd");
		}

	// set auto update
	this.setAutoupdate = function(callback="",interval="") {
		var app = this;

		if (interval == "")		{ interval = this.appUpdate; this.appUpdateCurrent = this.appUpdate; }
		if (app.appIntervalMain != -1) { clearInterval(app.appIntervalMain); app.appIntervalMain = -1; }

		if (interval > 0) {
			console.log("Set reload intervall to "+interval+"s ...");
			app.appIntervalMain = setInterval(function(){app.load("setAutoupdate")}, interval * 1000);
			if (callback!="") {
				app.appIntervalCall = setInterval(function(){callback()}, interval * 1000);
				}
			}
		else {
			console.log("Cleared reload interval ...");
			}
		}

	// set auto update - additional interval when loading data
	this.setAutoupdateLoading = function(on=true,info="") {
		var app = this;
		if (on && app.appIntervalTemp < 0) {
		    app.appUpdateCurrent = app.appUpdateTemp;
			app.appIntervalTemp = setInterval(function(){app.load("setAutoupdateLoading")}, this.appUpdateTemp * 1000);
			console.log("Add temporary reload interval to 1s for loading process ("+on+"/"+app.appIntervalTemp+"/"+info+") ...");
			}
		else if (on == false && app.appIntervalTemp > 0) {
		    this.appUpdateCurrent = this.appUpdate;
			console.log("Clear temporary reload interval for loading process ("+on+"/"+app.appIntervalTemp+"/"+info+") ...");
			clearInterval(app.appIntervalTemp);
			app.appIntervalTemp = -1;
			}
		}

	// SUPPORT FUNCTIONS
	// ------------------------

    // set <div id="name_status"> to color code
	this.setStatus = function(cmd) {
                e = document.getElementById(this.appStatField);
                c = "gray";

		if      (cmd == "waiting")  { c = "yellow"; } // yellow
		else if (cmd == "running")  { c = "green";  } // green
		else if (cmd == "error")    { c = "red";    } // red
		else                        { } // gray

		if (e) { e.style.borderColor = c; }
		}

	this.setTextById = function (id, text) {
		if (document.getElementById(id)) 	{ document.getElementById(id).innerHTML = text; }
		else if (jcAppTest)			{ console.warn("Error in "+this.appName+".setTextById: not found ("+text.substring(0,50)+")"); }
		}

	this.isHidden = function (id) {
		if (jcAppTest) { console.debug(this.appName + ".isHidden: " + id); }
		var element = document.getElementById( id );
		var style   = window.getComputedStyle( element );
		return (style.display == 'none');
		}

	this.elementHidden = function (id) {
		if (jcAppTest) { console.debug(this.appName + ".elementHidden: " + id); }
		document.getElementById(id).style.display = "none";
		}

	this.elementVisible = function (id) {
		if (jcAppTest) { console.log(this.appName + ".elementVisible: " + id); }
		document.getElementById(id).style.display = "block";
  		}

}

module_scripts_loaded += 1;

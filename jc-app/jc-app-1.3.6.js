// jcApp - REST API Interaction Framework
// by (c) Christoph Kloth
//==============================================================================
// USAGE:
//
// var myApp   = new jcApp( "myApp", RESTurl, "remote/list/", "remoteSend/");     // cmd: <device>/<cmd>
// myApp.init( "data_log", "error_log", reloadInterval, printAppStatus );
// myApp.loadWhenSend = true;
// myApp.callback     = true; // sendCmd -> use 2nd param as callback function (if exist)
// myApp.load( );
// myApp.setAutoupdate( );
//
// function printAppStatus(data) {
//	document.write(data[]);
//	}
//
//------------------------------------------------------


var jcAppTest    = true;

// Class to us JC REST API for server management
//------------------------------------------------------

function jcApp( name, url, list_cmd, send_cmd ) {

	this.appName      = name;
	this.appVersion   = "v1.3.6";
	this.appStatField = name + "_status";
	this.appUrl       = url;
	this.appList      = list_cmd;
	this.appSend      = send_cmd;

	this.appData      = {};		// data, got by load
	this.appSendData  = {};		// data, got by last used command
	this.appHideError = false;	// if error log should not be shown automaticly, set true

	this.errorList    = [];
	this.errorCount   = 50;
	this.loadWhenSend = false;
	this.async        = true;
	this.lastConnect  = 0;
	this.timeout      = -1;

	// add container for data & error messages (if <body id="this.appName">) 
	if (document.getElementById(this.appName)) {
		document.getElementById(this.appName).innerHTML +=
		"<div id='" + this.appName + "_data'></div>" +
		"<div id='" + this.appName + "_error' class='jc_error_log'></div>" +
		"<div id='" + this.appName + "_msg'></div>";
		}
	else { console.log("test3: "+this.appName); }

	console.log("Start " + this.appName + " (jcApp " + this.appVersion + ")");

	// set central parameteres
	this.init      = function( data_container, error_container, update_interval, printFunction ) {

		if (data_container!="") {
			this.appTarget     = data_container; }			// html element for app content (if required)
		else {	this.appTarget	   = this.appName + "_data"; }
		if (error_container!="") {
			this.appError      = error_container; } 		// html element for error messages (additionally console messages are generated)
		else {	this.appError	   = this.appName + "_error"; }

		if (jcAppTest) { console.log("Container: "+this.appTarget+"/"+this.appError); }

		this.appUpdate     = update_interval;	// interval for reload;
		this.printFunction = printFunction;	// callback for this.load();

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
	this.errorLog   = function( new_msg, start_time ) {
		var msg   = document.getElementById(this.appError).innerHTML;
		var stamp = new Date();
		var time  = stamp.toLocaleTimeString();

		this.errorList = this.errorGetLog();

		if (start_time) {
			duration = (stamp.getTime() - start_time) / 1000; 
			//msg = time + ": " + new_msg + " (" + duration + "s)<br/>" + msg;
			this.errorList.unshift(time + ": " + new_msg + " (" + duration + "s)");
			}
		else {
			//msg = time + ": " + new_msg + "<br/>" + msg;
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

	// get time
	this.time       = function() {
		var old = this.lastConnect;
		var d = new Date();
		this.lastConnect = d.getTime();

		//console.log(old+"/"+this.lastConnect+"/"+(this.lastConnect-old));
		}


	// load data from REST API
	this.load	= function(source="") {
		var app  = this;
	        app.setStatus("waiting");
		app.requestAPI("GET",[app.appList],"", app.printFunction,"",source);
		return;
		}

	// send cmd to rest API
	this.requestAPI = function( method, cmd, data, callback="", wait_till_executed="", source="") {

		var app  	 	= this;
		var start_time	 	= new Date();
		var transfer_cmd 	= "";

		// create request URL
		var requestURL	 	= this.appUrl + this.appSend + cmd[0];
		for (var i=1;i<cmd.length;i++) {
			if (cmd[i]) { requestURL += "/" + cmd[i]; }
			transfer_cmd += cmd[i] + "_";
			}
		requestURL += "/";
		requestURL = encodeURI(requestURL);

		// check if method supported
		var accepted_methods 	= ["GET","POST","DELETE","PUSH","PATCH","PUT"];
		if (accepted_methods.indexOf(method)<0) { console.error( this.appName + ": RequestAPI - ERROR, method not allowed ("+method+"/"+source+")." ); return; }

		// asynchronous transfers per default, synchronous transfer if requested
		var asyncronous = true;	 		
		if (wait_till_executed == "wait") { 			
			console.debug("Synchronous tranfer used for request: " + requestURL);
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

				console.debug(app.appName + ": " +requestURL);
				console.debug(data);

              			app.errorLog( 'Success: ' + app.appName + ' - ' + requestURL + ' (' + xhttp.status + ').',start_time);
				app.setStatus('running');
				app.time();
				app.appSendData = data;

				var m = new Date();
				if (!data["REQUEST"]) { data["REQUEST"] = {}; }
				data["REQUEST"]["load-time-app"] = m-start_time;
				data["REQUEST"]["request-url"]   = requestURL;

				if (app.appErrorHide == false) 	app.elementVisible(app.appTarget);
				if (app.appErrorHide == false) 	app.elementHidden(app.appError);
				if (app.loadWhenSend) 		app.load("loadWhenSend");
				if (callback) 			callback(data);
				}
			else if (xhttp.readyState > 3 && xhttp.status>=400) {
				// finished (.readyState = 4) but error
				try		{ var data = JSON.parse(xhttp.responseText); }
				catch(e)	{ var data = {}; data["detail"] = xhttp.responseText; }
	                        app.errorLog('Error: ' + app.appName + ' - ' + method + ' / ' + requestURL + ' (not available/' + xhttp.readyState + '/' + xhttp.status + ').', start_time);
				app.errorLog('Error Detail: ' + data["detail"]);
	                        app.appSendData = {};
        	                app.setStatus("error");

	                        if (app.appErrorHide == false) 	app.elementHidden(app.appTarget);
        	                if (app.appErrorHide == false) 	app.elementVisible(app.appError);
                	        if (callback) 			callback();
				}
			}

		xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		
		// set timeout if defined
		if (this.timeout > -1) {
			xhttp.ontimeout = function () { console.error("The request for " + requestURL + " timed out.");	};
			xhttp.timeout = this.timeout;
			}

		if (data)	{ xhttp.send(JSON.stringify(data)); }
		else		{ xhttp.send(); }

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


	// send cmd to rest API - initial => to stay compartible
	this.sendCmd     = function( cmd, callback, wait="" ) {
		var data = {};
		this.requestAPI("GET", cmd, data, callback, wait, "sendCmd");
		}

	// send cmd to rest API (synchronuous) => to stay compartible
	this.sendCmdSync = function( cmd, callback ) {
		var data = {};
		this.requestAPI("GET", cmd, data, callback, "wait", "sendCmdSync");
		}

	// send cmd to rest API including a password => to stay compartible
	this.sendCmdPwd     = function( cmd, pwd, callback ) {
		var data = {};
		cmd.push( pwd );
		this.requestAPI("GET", cmd, data, callback, "", "sendCmdPwd");
		}


	// set auto update
	this.setAutoupdate = function(callback="") {
		var app = this;

		if (jcAppTest) { console.log( this.appName + ": Set Autoupdate: " + this.appUpdate ); }

		if (app.appUpdate > 0) {
			console.log("set reload intervall to "+app.appUpdate+"s ...");
			setInterval(function(){app.load("setAutoupate")}, app.appUpdate * 1000);
			if (callback!="") {
				setInterval(function(){callback()}, app.appUpdate * 1000);
				}
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

//--------------------------------------
// EoF

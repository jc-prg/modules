//--------------------------------------
// jc://birdhouse/, (c) Christoph Kloth
//--------------------------------------
// settings
//--------------------------------------

var app_settings_active = false;
var birdhouse_settings  = new birdhouse_app_settings();


function birdhouse_app_settings (name="Settings") {

    this.init = function () {
        this.set             = appSettings;
        this.tab             = new birdhouse_table();
        this.tab.style_rows["height"] = "27px";
        this.tab.style_cells["width"] = "40%";
        this.frames_settings = this.set.frames_settings;
        this.frames_content  = this.set.frames_content;
        this.loading         = "<center>&nbsp;<br/>" + lang("PLEASE_WAIT") + " ...<br/>&nbsp;</center>";
        this.not_implemented = "<center>&nbsp;<br/>" + lang("NOT_IMPLEMENTED") + "<br/>&nbsp;</center>";
        }

    this.create = function (type="SETTINGS") {
        this.setting_type = type;
        app_active_page = type;
        birdhouse_genericApiRequest("GET", ["status"], birdhouseStatus_print);
        if (app_data["STATUS"]["server"]["initial_setup"]) {
            html = "<center><br/>&nbsp;&nbsp;<br/><img src='"+app_loading_image+"' width='250'><br/>&nbsp;<br/>"+lang("PLEASE_WAIT")+"<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;<br/></center>";
            setTextById(app_frame_content, html);
            }
      	setTimeout(function(){
      	    birdhouse_settings.create_exec(type);
		}, 500);
		//birdhouse_KillActiveStreams();
    	window.scrollTo(0,0);
    }

	this.create_exec = function (type="") {

        this.tab = new birdhouse_table();
        this.tab.style_rows["height"] = "27px";
        this.tab.style_cells["width"] = "40%";
        var tab = this.tab;

        var html = "";
        var initial_setup   = app_data["STATUS"]["server"]["initial_setup"];

        var current_url     = window.location.href;
        var current_server  = current_url.split("//")[1];
        current_server      = current_server.split("/")[0];
        this.current_server = current_server.split(":")[0];

        var open_settings = {
            "app_info_01" : false,
            "device_info" : false,
            "process_info": false,
            "server_info" : false,
            "api_calls"   : false,
            "api_info"    : false,
            "app_info_02" : false,
            "display_info": false,
            "app_under_construction": false
            }

        if (initial_setup) {
            open_settings["app_info_01"] = false;
            open_settings["server_info"] = false;
            open_settings["device_info"] = false;

            var img = "<img src='"+app_loading_image+"' width='250'><br/>&nbsp;<br/>";
            appMsg.confirm(img + lang("INITIAL_SETUP"), "console.log('.');", 400);
            }
        else if (this.setting_type == "INFO_ONLY") {
            open_settings["app_info_01"]  = true;
            open_settings["device_info"]  = true;
            open_settings["process_info"] = true;
        }
        else if (this.setting_type == "PROCESSING") {
            open_settings["process_info"] = true;
            }
        else {
            open_settings["app_info_01"]  = true;
            }

        if (this.setting_type != "INFO_ONLY") {
            html  = "<h2>Information</h2>";
            html += "<hr style='border:1px solid gray;'>"
        }

        html_entry = this.app_information();
        html += birdhouse_OtherGroup( "app_info_01", "App Information (Versions)", html_entry, open_settings["app_info_01"] );

        html_entry = this.device_information();
        html += birdhouse_OtherGroup( "device_info", "Device Information", html_entry, open_settings["device_info"] );

        html_entry = this.process_information();
        html += birdhouse_OtherGroup( "process_info", "Process Information &nbsp;<div id='processing_info_header'></div>", html_entry, open_settings["process_info"] );

        html_entry = this.api_information();
        html += birdhouse_OtherGroup( "api_info", "API Information &nbsp;<div id='api_info_header'></div>", html_entry, open_settings["api_info"] );

        html_entry = this.server_information();
        html += birdhouse_OtherGroup( "server_info", "Server Information &nbsp;<div id='server_info_header'></div>", html_entry, open_settings["server_info"] );

        if (this.setting_type == "SETTINGS") {
            html_entry = this.display_information();
            html += birdhouse_OtherGroup( "display_info", "Display information", html_entry, open_settings["display_info"] );

            html_entry = this.app_information_detail();
            html += birdhouse_OtherGroup( "app_info_02", "App Information (Cookie, Reload)", html_entry, open_settings["app_info_02"] );

            }

        if (this.setting_type == "INFO_ONLY") {
            setTextById(app_frame_header, "<center><h2>" + lang("INFORMATION")) + "</h2></center>";
            setTextById("frame2", html)
            }
        else if (this.setting_type == "SETTINGS" || this.setting_type == "PROCESSING") {
            html += "<br/>&nbsp<br/>";
            html += this.settings();

            setTextById(app_frame_header, "<center><h2>" + lang("SETTINGS")) + "</h2></center>";
            setTextById(app_frame_content, html);
            }
		}

    this.create_new = function (type="") {
        this.set.show(true);
        window.scrollTo(0, 0);
        if (type == "info") {
            this.setting_type = "PROCESSING";
            this.set.write(1, lang("INFORMATION"), this.information());
            this.set.write(2, "", "");
            this.set.show_entry(2);
            app_active_page = "INFORMATION";
            }
        else if (type == "settings") {
            this.setting_type = "SETTINGS";
            this.set.clear_frames();
            this.set.clear_content_frames();
            this.set.write(1, lang("SETTINGS"), this.settings());
            this.set.show_entry(-1);
            app_active_page = "SETTINGS";
            }
        else if (type == "image") {
            this.setting_type = "IMAGE_SETTINGS";
            this.set.clear_frames();
            this.set.clear_content_frames();
            this.set.write(1, "", this.loading);
            this.set.write(2, "", "");
            this.set.show_entry(2);
            birdhousePrint_load('IMAGE_SETTINGS',app_active_cam);
            }
        else if (type == "statistics") {
            this.setting_type = "STATISTICS";
            this.set.clear_frames();
            this.set.clear_content_frames();
            this.set.write(1, "", this.loading);
            this.set.write(2, "", "");
            this.set.show_entry(2);
            birdhousePrint_load('STATISTICS',app_active_cam);
            }
        else if (type == "devices") {
            this.setting_type = "DEVICE_SETTINGS";
            this.set.clear_frames();
            this.set.clear_content_frames();
            this.set.write(1, "", this.loading);
            this.set.write(2, "", "");
            this.set.show_entry(2);
            birdhousePrint_load('DEVICE_SETTINGS',app_active_cam);
            }
        else if (type == "cameras") {
            this.setting_type = "CAMERA_SETTINGS";
            this.set.clear_frames();
            this.set.clear_content_frames();
            this.set.write(1, "", this.loading);
            this.set.write(2, "", "");
            this.set.show_entry(2);
            birdhousePrint_load('CAMERA_SETTINGS',app_active_cam);
            }

        }

    this.information = function () {

        var open_settings = {
            "app_info_01" : true,
            "device_info" : false,
            "process_info": false,
            "server_info" : false,
            "api_calls"   : false,
            "api_info"    : false,
            "app_info_02" : false,
            "display_info": false,
            "app_under_construction": false
            }

        var html = "";
        var html_entry = "";

        html_entry = this.app_information();
        html += birdhouse_OtherGroup( "app_info_01", "App Information (Versions)", html_entry, open_settings["app_info_01"] );

        html_entry = this.device_information();
        html += birdhouse_OtherGroup( "device_info", "Device Information", html_entry, open_settings["device_info"] );

        html_entry = this.process_information();
        html += birdhouse_OtherGroup( "process_info", "Process Information &nbsp;<div id='processing_info_header'></div>", html_entry, open_settings["process_info"] );

        html_entry = this.api_information();
        html += birdhouse_OtherGroup( "api_info", "API Information &nbsp;<div id='api_info_header'></div>", html_entry, open_settings["api_info"] );

        html_entry = this.server_information();
        html += birdhouse_OtherGroup( "server_info", "Server Information &nbsp;<div id='server_info_header'></div>", html_entry, open_settings["server_info"] );

        html_entry = this.display_information();
        html += birdhouse_OtherGroup( "display_info", "Display Information", html_entry, open_settings["display_info"] );

        return html;
        }

    this.settings = function () {
        var tab = new birdhouse_table();
        var settings = app_data["SETTINGS"];

        var timezones = "UTC-12,UTC-11,UTC-10,UTC-9,UTC-8,UTC-7,UTC-6,UTC-5,UTC-4,UTC-3,UTC-2,UTC-1,UTC+0,UTC+1,UTC+2,UTC+3,UTC+4,UTC+5,UTC+6,UTC+7,UTC+8,UTC+9,UTC+10,UTC+11,UTC+12"

        var html = "";
        //var html = "&nbsp;<br/><h2>&nbsp;<br/>"+lang("SETTINGS")+"</h2>";
        //html += "<hr style='border:1px solid gray;'>"
        html += "<div style='display:none'>Edit initial setup: <select id='set_initial_setup'><option selected>false</option></select>";
        html += "<input id='set_initial_setup_data' value='server:initial_setup'>";
        html += "<input id='set_initial_setup_data_type' value='boolean'></div>";

        html_entry = this.tab.start();
        html_entry += this.tab.row("Title:&nbsp;",              birdhouse_edit_field(id="set_title", field="title", type="input") );
        html_entry += this.tab.row("Language:&nbsp;",           birdhouse_edit_field(id="set_language", field="localization:language", type="select", options="EN,DE") );
        html_entry += this.tab.row("Timezone:&nbsp;",           birdhouse_edit_field(id="set_timezone", field="localization:timezone", type="select", options=timezones, data_type="string") );
        html_entry += this.tab.row("<hr/>");
        html_entry += this.tab.row("Backup-Time:&nbsp;",        birdhouse_edit_field(id="set_backup", field="backup:time", type="input") );
        html_entry += this.tab.row("BU Index Favorite:&nbsp;",  birdhouse_edit_field(id="set_preview_fav", field="backup:preview_fav", type="select", options="true,false", data_type="boolean") );
        html_entry += this.tab.row("BU Index Time:&nbsp;",      birdhouse_edit_field(id="set_preview", field="backup:preview", type="input") );
        html_entry += this.tab.row("<hr/>");

        html_entry += this.tab.row("Index View:&nbsp;",         birdhouse_edit_field(id="set_index_view", field="views:index:type", type="select", options="default,overlay,picture-in-picture", data_type="string") );
        html_entry += this.tab.row("LowRes Position (CAM1):&nbsp;",    birdhouse_edit_field(id="set_index_lowres", field="views:index:lowres_pos_cam1", type="select", options="1,2,3,4", data_type="integer") );
        html_entry += this.tab.row("LowRes Position (CAM2):&nbsp;",    birdhouse_edit_field(id="set_index_lowres2", field="views:index:lowres_pos_cam2", type="select", options="1,2,3,4", data_type="integer") );

        var id_list = "set_preview_fav:set_initial_setup:set_language:";
        id_list    += "set_timezone:set_title:set_backup:set_preview:set_rpi:set_index_lowres:set_index_view:set_index_lowres2";
        //id_list    += ":set_db_server:set_db_clean_up:set_db_type:set_ip4_video_port:set_weather_location:set_ip4:set_port:set_ip4_audio:set_ip4_video:set_ip4_deny:";

        var button2 = "";
        if (app_data["STATUS"]["server"]["initial_setup"]) {
            button2 = "<button onclick='window.open(window.location.href.split(\"?\")[0]+\"?CAMERAS\", \"_self\");' style='background:gray;width:100px;overflow:hidden;float:left;'>"+lang("DEVICE_SETTINGS_PROCEED_1")+"</button>";
            button2 = "<button onclick='window.open(window.location.href.split(\"?\")[0]+\"?DEVICES\", \"_self\");' style='background:gray;width:100px;overflow:hidden;float:left;'>"+lang("DEVICE_SETTINGS_PROCEED_2")+"</button>";
            }

        html_entry += this.tab.row("&nbsp;");
        html_entry += this.tab.row("", birdhouse_edit_save("set_main",id_list) + "&nbsp;" + button2);

        html_entry += this.tab.row("&nbsp;");
        html_entry += this.tab.end();

        var main_settings_open = false;
        if (app_data["STATUS"]["server"]["initial_setup"]) {main_settings_open = true; }
        html += birdhouse_OtherGroup( "APP_SETTINGS", "APP Settings", html_entry, main_settings_open, "settings" );

        html_entry = this.server_side_settings();
        html += birdhouse_OtherGroup( "SRV_SETTINGS", "SERVER settings <i>(edit in &quot;.env&quot;)</i>", html_entry, false, "settings" );

        html_entry = this.api_calls(show="maintenance");
        html_entry += "&nbsp;<br/>";
        html += birdhouse_OtherGroup( "SRV_MAINTENANCE", "SERVER maintenance", html_entry, false, "settings" );

        html_entry = this.api_calls(show="api");
        html_entry += "&nbsp;<br/>";
        html += birdhouse_OtherGroup( "api_calls", "Development: API Calls", html_entry, false, "settings" );

        html_entry = this.app_under_construction();
        html += birdhouse_OtherGroup( "app_under_construction", "Development: Direct Links", html_entry, false, "settings" );

        return html;
    }

    this.server_side_settings = function() {
        var settings = app_data["SETTINGS"];
        var status   = app_data["STATUS"];
        if (settings["server"]["rpi_active"])           { rpi_active = "true"; } else { rpi_active = "false"; }
        if (settings["server"]["detection_active"])     { detection_active = "true"; } else { detection_active = "false"; }
        if (settings["server"]["daily_clean_up"])       { daily_clean_up = "true"; } else { daily_clean_up = "false"; }

        if (settings["server"]["database_server"] && settings["server"]["database_server"] != "") {
            var link = "http://"+settings["server"]["database_server"]+":"+settings["server"]["database_port"]+"/_utils/";
        }
        else {
            var link = "http://"+this.current_server+":"+settings["server"]["database_port"]+"/_utils/";
        }

        var html_internal = "";
        html_internal += this.tab.start();
        html_internal += this.tab.row("DB Server:&nbsp;",          settings["server"]["database_server"]);
        html_internal += this.tab.row("DB Type:&nbsp;",            settings["server"]["database_type"]);
        html_internal += this.tab.row("DB Daily Clean Up:&nbsp;",  daily_clean_up);
        html_internal += this.tab.row("DB Port:&nbsp;",            settings["server"]["database_port"]);
        html_internal += this.tab.row("DB Admin:",                 "<a href='"+link+"' target='_blank'>"+link+"</a>");
        html_internal += this.tab.row("<hr/>");

        html_internal += this.tab.row("HTTP Server:&nbsp;",        settings["server"]["ip4_address"]);
        html_internal += this.tab.row("HTTP Port:&nbsp;",          settings["server"]["port"]);
        html_internal += this.tab.row("Video stream port:&nbsp;",  settings["server"]["port_video"]);
        html_internal += this.tab.row("Audio stream server:&nbsp;",settings["server"]["server_audio"]);
        html_internal += this.tab.row("Audio stream port:&nbsp;",  settings["server"]["port_audio"]);
        html_internal += this.tab.row("RPi Active:&nbsp;",         rpi_active);
        html_internal += this.tab.row("Object detection:&nbsp;",   detection_active);

        if (detection_active == true || detection_active == "true") {
            var loading_info = status["object_detection"]["status"] + " - " + status["object_detection"]["status_details"];
            if (status["object_detection"]["status"] == true)   { loading_info += " - " + JSON.stringify(status["object_detection"]["models_loaded"]).replaceAll(",", ", ").replaceAll(":", " : "); }
            else                                                { loading_info = "<font color=" + header_color_error + ">" + loading_info + "</font>"; }
            html_internal += this.tab.row("Object detection loaded:&nbsp;", loading_info);
            }

        html_internal += this.tab.row("<hr>");
        html_internal += this.tab.row("Admin access via:&nbsp;",   settings["server"]["admin_login"]);
        html_internal += this.tab.row("ADM Deny from IP4:&nbsp;",  settings["server"]["ip4_admin_deny"]);
        html_internal += this.tab.row("ADM Allow from IP4:&nbsp;", settings["server"]["ip4_admin_allow"]);

        html_internal += this.tab.row("&nbsp;");
        html_internal += this.tab.end();

        return html_internal;
    }

	this.api_calls = function (show="all") {
	    var api_call        = "";
        var cameras         = app_data["SETTINGS"]["devices"]["cameras"];
        var microphones     = app_data["SETTINGS"]["devices"]["microphones"];
        var relays          = app_data["SETTINGS"]["devices"]["relays"];
        delete this.tab.style_cells["width"];
        var html_entry      = this.tab.start();

        if (show == "all" || show == "api") {
            api_call    = "<button onclick='window.open(\"" + RESTurl + "api/no-id/list/\",\"_blank\");' class='button-settings-api';>LIST</button>";
            api_call   += "<button onclick='window.open(\"" + RESTurl + "api/no-id/INDEX/\",\"_blank\");' class='button-settings-api';>INDEX</button>";
            api_call   += "<button onclick='window.open(\"" + RESTurl + "api/no-id/OBJECTS/\",\"_blank\");' class='button-settings-api'>OBJECTS</button>";
            api_call   += "<button onclick='window.open(\"" + RESTurl + "api/no-id/STATISTICS/\",\"_blank\");' class='button-settings-api'>STATISTICS</button>";
            api_call   += "<button onclick='window.open(\"" + RESTurl + "api/no-id/FAVORITES/\",\"_blank\");' class='button-settings-api'>FAVORITES</button>";
            api_call   += "<button onclick='window.open(\"" + RESTurl + "api/no-id/weather/\",\"_blank\");' class='button-settings-api';>WEATHER</button>";
            api_call   += "<button onclick='window.open(\"" + RESTurl + "api/no-id/last-answer/\",\"_blank\");' class='button-settings-api';>LAST ANSWER</button>";
            html_entry += this.tab.row("API Calls", api_call);
            }

        if (show == "all") {
            api_call    = "<button onclick='birdhouse_forceBackup();' class='button-settings-api'>Force Backup</button>";
            api_call   += "<button onclick='birdhouse_forceRestart();' class='button-settings-api'>Force Restart</button>";
            api_call   += "<button onclick='birdhouse_forceUpdateViews(\"all\");' class='button-settings-api'>Update Views</button>";
            api_call   += "<button onclick='birdhouse_forceUpdateViews(\"all\",true);' class='button-settings-api'>Update Views Complete</button>";
            api_call   += "<button onclick='birdhouse_recreateImageConfig();' class='button-settings-api'>NewImgCfg</button>";
            api_call   += "<button onclick='birdhouse_removeDataToday();' class='button-settings-api'>CleanAllToday</button>";
            api_call   += "<button onclick='birdhouse_checkTimeout();' class='button-settings-api'>Timeout</button>";
            html_entry += this.tab.row("API Commands", api_call);
            }

        if (show == "maintenance") {
            api_call    = "<button onclick='birdhouse_forceRestart();' class='button-settings-api'>Force Restart</button>";
            html_entry += this.tab.row("Restart", api_call);
            api_call    = "<button onclick='birdhouse_forceUpdateViews(\"all\");' class='button-settings-api'>Update Views</button>";
            api_call   += "<button onclick='birdhouse_forceUpdateViews(\"all\",true);' class='button-settings-api'>Update Views Complete</button>";
            html_entry += this.tab.row("Update Views", api_call);
            api_call    = "<button onclick='birdhouse_recreateImageConfig();' class='button-settings-api'>NewImgCfg</button>";
            api_call   += "<button onclick='birdhouse_removeDataToday();' class='button-settings-api'>CleanAllToday</button>";
            api_call   += "<button onclick='birdhouse_forceBackup();' class='button-settings-api'>Force Backup</button>";
            html_entry += this.tab.row("Data", api_call);
            api_call    = "<button onclick='birdhouse_checkTimeout();' class='button-settings-api'>Timeout</button>";
            html_entry += this.tab.row("Test app timeout", api_call);
            }

	    if (show == "all" || show == "api" || show == "devices") {
            for (let camera in cameras) {
                api_call  = "<button onclick='window.open(\"" + RESTurl + "api/no-id/TODAY/"+camera+"/\",\"_blank\");' class='button-settings-api'>Today "+camera.toUpperCase()+"</button>";
                api_call += "<button onclick='window.open(\"" + RESTurl + "api/no-id/TODAY_COMPLETE/"+camera+"/\",\"_blank\");' class='button-settings-api'>Compl. "+camera.toUpperCase()+"</button>";
                api_call += "<button onclick='window.open(\"" + RESTurl + "api/no-id/ARCHIVE/"+camera+"/\",\"_blank\");' class='button-settings-api'>Archive "+camera.toUpperCase()+"</button>";
                html_entry += this.tab.row("API "+camera, api_call);
            }

            for (let micro in microphones) {
                api_call    = "<button onclick='birdhouse_recordStartAudio(\""+micro+"\");' class='button-settings-api'>Record "+micro+"</button>";
                api_call   += "<button onclick='birdhouse_recordStopAudio(\""+micro+"\");' class='button-settings-api'>Stop "+micro+"</button>";
                html_entry += this.tab.row("API "+micro, api_call);
            }

            for (let relay in relays) {
                api_call    = "<button onclick='birdhouse_relayOnOff(\""+relay+"\",\"on\");' class='button-settings-api'>"+relay+" ON</button>";
                api_call   += "<button onclick='birdhouse_relayOnOff(\""+relay+"\",\"off\");' class='button-settings-api'>"+relay+" OFF</button>";
                html_entry += this.tab.row("API " + relay, api_call);
                }
            }

        html_entry += this.tab.end();
        this.tab.style_cells["width"] = "40%";
        return html_entry;
	}

	this.api_information = function () {
        var html = "&nbsp;<br/>";
        var tab  = new birdhouse_table();
	    var answer = appFW.getAverageRequestDurations();

        html += "<i><b>Average API response times per API request:</i></b><br/>&nbsp;<br/>";
	    html += this.tab.start();
	    Object.keys(answer).forEach(key => {
	        var key_print = key.replace(app_session_id, "");
	        var key_parts = key.split("/");
	        if (/^\d+$/.test(key_parts[1])) { key_print = key_print.replace("/" + key_parts[1],""); }
	        html += this.tab.row(key_print, answer[key].toFixed(3)+"s");
	        });
	    html += this.tab.end();
	    html += "&nbsp;";

	    return html;
	    }

	this.app_information = function () {
	    var instance = " (prod)";
	    if (test) { instance = " (test)"; }
		var html_entry = this.tab.start();
		html_entry += this.tab.row("App:",	"<a href='/app/index.html?INFORMATION&" + app_session_id + "' target='_blank'>"+ app_title + "</a>" + instance);
		html_entry += this.tab.row("Versions:",
						"App: " 		+ app_version + "<br/>" +
						"Server: "      + app_data["API"]["version"] + "<br/>" +
						"jcMsg: " 		+ appMsg.appVersion + "<br/>" +
						"jcApp: "		+ appFW.appVersion);
		html_entry += this.tab.row("Source:","<a href='https://github.com/jc-prg/birdhouse-cam/' target='_blank'>https://github.com/jc-prg/birdhouse-cam/</a>");
		html_entry += this.tab.row("&nbsp;");
		html_entry += this.tab.end();
        return html_entry;
	}

	this.app_information_detail = function () {
	    var html_entry = "";
        html_entry = this.tab.start();
        html_entry += this.tab.row("Reload Interval:", app_reload_interval + "s");
        html_entry += this.tab.row("Active Camera:&nbsp;", app_active_cam);
        html_entry += this.tab.row("Active Client Streams:&nbsp;", "<font id='show_stream_count_client'>0 Streams</font>");
        html_entry += this.tab.row("Available Cameras:&nbsp;", app_available_cameras.length);
        html_entry += this.tab.row("Active Page:&nbsp;", app_active_page);
        html_entry += this.tab.row("Active Date:&nbsp;", app_active_date);
        html_entry += this.tab.row("Unique stream URL:&nbsp;", app_unique_stream_url);
        html_entry += this.tab.row("Unique stream ID:&nbsp;",	app_unique_stream_id);
        html_entry += this.tab.end();
        return html_entry;
	}

	this.display_information = function () {
	    var html_entry = "";
        html_entry = this.tab.start();
        html_entry += this.tab.row("Window Size:", "<text id='windowWidth'>"+window.innerWidth + "x" + window.innerHeight+"</text>" );
        html_entry += this.tab.row("Screen Size:", "<text id='screenWidth'>"+screen.width + "x" + screen.height+"</text>" );
        html_entry += this.tab.row("Position:", "<div id='scrollPosition'>0 px</div>" );
        html_entry += this.tab.row("Format:", print_display_definition());
        html_entry += this.tab.row("Browser:", navigator.userAgent);
        html_entry += this.tab.end();
        return html_entry;
    }

	this.server_information = function () {
        var html_entry = this.tab.start();
    	html_entry += this.tab.row("Server Connection:",   "<div id='system_info_connection'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("Server start time:",   "<div id='system_info_start_time'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("Active Streams:",      "<div id='system_active_streams'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("Queue waiting time:",  "<div id='system_queue_wait'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("Health check:",        "<div id='system_health_check'>"+lang("PLEASE_WAIT")+"..</div>");
        html_entry += this.tab.row("<hr/>");
    	html_entry += this.tab.row("DB Connection:",       "<div id='system_info_db_connection'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("DB Handler:",          "<div id='system_info_db_handler'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("DB:",                  "<div id='system_info_db_error'>"+lang("PLEASE_WAIT")+"..</div>");
        html_entry += this.tab.row("<hr/>");
    	html_entry += this.tab.row("CPU Temperature:",     "<div id='system_info_cpu_temperature'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("CPU Usage:",           "<div id='system_info_cpu_usage'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("CPU Usage (Details):", "<div id='system_info_cpu_usage_detail'>"+lang("PLEASE_WAIT")+"..</div>");
        html_entry += this.tab.row("<hr/>");
    	html_entry += this.tab.row("Memory Used:",         "<div id='system_info_mem_used'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("Memory Total:",        "<div id='system_info_mem_total'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("HDD used:",            "<div id='system_info_hdd_used'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("HDD data:",            "<div id='system_info_hdd_data'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("HDD archive:",         "<div id='system_info_hdd_archive'>"+lang("PLEASE_WAIT")+"..</div>");
    	html_entry += this.tab.row("HDD total:",           "<div id='system_info_hdd_total'>"+lang("PLEASE_WAIT")+"..</div>");
        html_entry += this.tab.row("&nbsp;");
        html_entry += this.tab.end();
        return html_entry;
	}

	this.device_information = function () {
	    var status   = app_data["STATUS"]["object_detection"];
        var tab      = new birdhouse_table();
        tab.style_rows["height"]        = "27px";
        tab.style_cells["min-width"]    = "150px";
        tab.style_cells["width"]        = "50%";

	    var html = birdhouseDevices("", app_data, show="information");

        if (status["active"]) {
            html += tab.start();
            Object.entries(status["models_loaded"]).forEach(([key,value])=> {
                var description = "Detection " + key + " (" + value + "):";
                var action = "<div style='float:left;'>";
                action += "<div id='status_" + key + "_detection_active' style='float:left;'><div id='black'></div></div>";
                action += "<div id='status_" + key + "_detection_loaded' style='float:left;'><div id='black'></div></div>";

                html += tab.row(description, action);
                });
            html += tab.end();
            }
        else {
            html += "<i>" + lang("OBJECT_DETECTION_INACTIVE") + "</i><br/>&nbsp;";
            }
        html += "<br/>&nbsp;<br/>";

	    return html;
	}

	this.process_information = function () {
	    var html = "";
        var tab      = new birdhouse_table();
        tab.style_rows["height"] = "27px";
        tab.style_cells["width"] = "50%";
        tab.style_cells["vertical-align"] = "top";

        var process_information = {
            "Object Detection":                 "processing_object_detection",
            "Download preparation":             "processing_downloads",
            "Loading archive view":             "processing_archive_view",
            "Loading favorite view":            "processing_favorite_view",
            "Loading object detection view":    "processing_object_view",
            "Backup process":                   "processing_backup",
            "Video recording / processing":     "processing_video",
        }

        html += tab.start();
        Object.entries(process_information).forEach(([key, value]) => {
            html += tab.row(key+":", "<div id='" + value + "'>N/A</div>");
        });
        html += tab.end();
        html += "<br/>&nbsp;<br/>";

 	    return html;
	    }

	this.app_under_construction = function() {
		var html_entry = this.tab.start();
		link = RESTurl + "stream.mjpg?cam1";
		html_entry += this.tab.row("Stream:", "<a href='"+link+"' target='_blank'>"+link+"</a>");
		link = RESTurl + "lowres/stream.mjpg?cam1";
		html_entry += this.tab.row("Stream LowRes:", "<a href='"+link+"' target='_blank'>"+link+"</a>");
		link = RESTurl + "detection/stream.mjpg?cam1";
		html_entry += this.tab.row("Stream Detection Areas:", "<a href='"+link+"' target='_blank'>"+link+"</a>");
		link = RESTurl + "object/stream.mjpg?cam1";
		html_entry += this.tab.row("Stream Object Detection:", "<a href='"+link+"' target='_blank'>"+link+"</a>");
		link = RESTurl + "pip/stream.mjpg?cam1+cam2:1";
		html_entry += this.tab.row("Stream Picture-in-Picture:", "<a href='"+link+"' target='_blank'>"+link+"</a>");

        var direct_links = ["ARCHIVE", "FAVORITES", "TODAY", "SETTINGS", "INFO", "PROCESSING"];

        for (var i=0;i<direct_links.length;i++) {
            link = window.location.href.split("?")[0] + "?" + direct_links[i];
            html_entry += this.tab.row("Direct Link "+direct_links[i]+":", "<a href='"+link+"' target='_blank'>"+link+"</a>");
            }

		html_entry += this.tab.row("&nbsp;");
		html_entry += this.tab.end();
        return html_entry;
	}

	this.toggle	= function (active=false) {

		if (active)	{ view_frame = "block"; view_settings = "none";  app_settings_active = false; window.scrollTo(0,0); }
		else		{ view_frame = "none";  view_settings = "block"; app_settings_active = true;  }

		for (var i=1;i<=app_frame_count;i++) {
			var element = document.getElementById("frame"+i);
			element.style.display = view_frame;
			}
		for (var i=1;i<=app_setting_count;i++) {
			var element = document.getElementById("setting"+i);
			element.style.display = view_settings;
			}
		}
}

app_scripts_loaded += 1;
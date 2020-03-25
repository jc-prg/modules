//--------------------------------------------------
// local HTML5 javascript player
//--------------------------------------------------
/* INDEX
function jcPlayer(name,element,music_url="", cover_url="", app_url="")
	this.init  	= function()
	this.button 	= function(img)
	this.scroll_to 	= function(element)
	this.load  	= function(data)
	this.update 	= function()
	this.musicStatus= function()

 	this.audio.onended 	= function()
	
	this.play  = function()
	this.pause = function()
	this.stop  = function()
	this.next  = function()
	this.last  = function()
	
	this.volumeSet  = function(vol)
	this.volumeUp   = function()
	this.volumeDown = function()
	this.volumeMute = function()
	
	this.sort_list 	= function(tracks)
	this.sortNumber = function(a,b)
	this.setTextById= function(id,text)
*/
//--------------------------------------------------
/* IMPLEMENTATION

var player = new jcPlayer("player","div_player","/music/","/cover/");
player.load( data );

*/
//--------------------------------------------------
/* DATA STRUCTURE

data = {
	"album" : {
		"album"        : "<album-title>",
		"title"        : "<album-title>",
		"artist"       : "<artist-name>",
		"uuid"         : "<album-uuid>",
		"tracks"       : ["<uuid-1>","<uuid-2>"],
		"cover_image"  : "<url-cover-image>",
		}
	"tracks" : [
		"<uuid-1>" : {
			"title"  : "...",
			"artist" : "...",
			"file"   : "...",
			},
		"<uuid-2>" : {
			"title" : "...",
			"artist" : "...",
			"file"  : "...",
			},
		]
	}

*/
//--------------------------------------------------


function jcPlayer(name,element,music_url="", cover_url="", app_url="") {

	// app basic data
	this.appName      = name;
	this.appElement   = element;
	this.appVersion   = "v0.1.4";
	this.appScrollTo  = "";
	this.appDir       = app_url + "jc-player/";

	// init vars
	this.activeData   = {};
	this.activeAlbum  = {};
	this.activeTracks = {};
	this.activeTrack  = 0;
	this.activePlay   = 0;
	this.activeSize   = 0;

	// active controls
	this.activeCtrl   = {};
	this.activeCtrl["buttons"]    = true;
	this.activeCtrl["progress"]   = true;
	this.activeCtrl["info_cover"] = true;
	this.activeCtrl["info_short"] = false;
	this.activeCtrl["progress_padding"] = "";

	// player control, audio, urls ...
	this.player      = "";
	this.audio       = document.createElement("audio");
	this.url	 = music_url;
	this.url_c	 = cover_url;
	this.playing     = 0;
	this.volume      = 1;


	// init player incl. controls
	this.init  = function() {
		var player  = "";
		var padding = "padding:0px;"
		//if (this.activeCtrl["progress_padding"] != "") { padding = "padding:"+this.activeCtrl["progress_padding"]+"px;"; }

		player += "<div id=\"jcPlayer_"+this.appName+"\" class=\"jcPlayer\" style=\""+padding+"\">";
		player += "<table class='jcPlayer_table'>";

		if (this.activeCtrl["info_cover"]) {
			player += "<tr><td class='jcPlayer_td_cover'>";
			player += 	"<div id=\"jcPlayer_"+this.appName+"_cover\" class=\"jcPlayer_cover\"></div>";
			player += "</td><td class='jcPlayer_td_info'>";
			player +=     "<div id=\"jcPlayer_"+this.appName+"_info\"  class=\"jcPlayer_info\">";
			player += 	"<div id=\"jcPlayer_"+this.appName+"_title\" class=\"jcPlayer_title\"><i>No title loaded ...</i></div>";
			player += 	"<div id=\"jcPlayer_"+this.appName+"_track\" class=\"jcPlayer_track\">&nbsp;</div>";
			player += 	"<div id=\"jcPlayer_"+this.appName+"_file\"  class=\"jcPlayer_file\" >&nbsp;</div><br/>";
			player +=     "</div>";
			player += "</td></tr>";
			}

		if (this.activeCtrl["info_short"]) {
			player += "<tr><td class='jcPlayer_td_info' colspan='2'>";
			player +=     "<div id=\"jcPlayer_"+this.appName+"_info\" class=\"jcPlayer_info short\">";
			player += 	"<div id=\"jcPlayer_"+this.appName+"_title\" class=\"jcPlayer_title\"><i>No title loaded ...</i></div>";
			player += 	"<div id=\"jcPlayer_"+this.appName+"_track\" class=\"jcPlayer_track\">&nbsp;</div>";
			player +=     "</div>";
			player += "</td></tr>";
			}

		if (this.activeCtrl["buttons"]) {
			player += "<tr><td colspan='2' class='jcPlayer_td_control'>";
			player +=    "<div id=\"jcPlayer_"+this.appName+"_control\" class=\"jcPlayer_control\"></div>";
			player +=	"<div id=\"jcPlayer_"+this.appName+"_last\"    class=\"jcPlayer_button\"  onclick=\""+this.appName+".last();\">"+this.button("back")+"</div>";
			player +=	"<div id=\"jcPlayer_"+this.appName+"_play\"    class=\"jcPlayer_button\"  onclick=\""+this.appName+".play();\">"+this.button("play")+"</div>";
			player +=	"<div id=\"jcPlayer_"+this.appName+"_next\"    class=\"jcPlayer_button\"  onclick=\""+this.appName+".next();\">"+this.button("next")+"</div>";
			player +=	"<div id=\"jcPlayer_"+this.appName+"_next\"    class=\"jcPlayer_button empty\"  onclick=\""+this.appName+".next();\"></div>";
			player +=	"<div id=\"jcPlayer_"+this.appName+"_plause\"  class=\"jcPlayer_button\"  onclick=\""+this.appName+".pause();\">"+this.button("pause")+"</div>";
			player +=	"<div id=\"jcPlayer_"+this.appName+"_stop\"    class=\"jcPlayer_button\"  onclick=\""+this.appName+".stop();\">"+this.button("stop")+"</div>";

			player +=	"<div id=\"jcPlayer_"+this.appName+"_next\"    class=\"jcPlayer_button empty\"  onclick=\""+this.appName+".next();\"></div>";
			player +=	"<div id=\"jcPlayer_"+this.appName+"_stop\"    class=\"jcPlayer_button\"  onclick=\""+this.appName+".scroll_to("+this.appName+".appScrollTo);\">"+this.button("goto")+"</div>";

			player +=     "</div>";
			player += "</td></tr>";
			}

		if (this.activeCtrl["progress"]) {
			player += "<tr id='jcPlayer_tr_progress' style='visibility:hidden;'><td class='jcPlayer_td_time'>";
			player += 	"<div id=\"jcPlayer_progresstime\"></div>";
			player += "</td><td class='jcPlayer_td_progress'>";
			player += 	"<div id=\"jcPlayer_progressbar\"><div id=\"jcPlayer_progress\"></div></div>";
			player += "</td></tr>";
			}
		player += "</table>";

		player +=   "</div>";
		player += "</div>";

		this.setTextById(this.appElement, player);
		}

	// image data
	this.button = function(img) {
		return "<img src=\""+this.appDir+"icon/"+img+".png\" class=\"jcPlayer_button_image\">";
		}

	// scroll to album details
	this.scroll_to = function(element) {
		console.log(this.appName +": Scroll to "+element);
		document.getElementById(element).scrollIntoView();
		}

	// load data
	this.load  = function(data) {
		// set vars
		this.activeData       = data;
		this.activeSize       = data["album"]["tracks"].length;
		this.activeAlbum      = data["album"];
		this.activeTracks     = data["tracks"];
		this.appScrollTo      = data["scrollto"];
		this.activeTracklist  = this.sort_list(data["tracks"]);

		this.activeCtrl["id_album"] = this.activeAlbum["uuid"];
		this.activeCtrl["id_track"] = this.activeTracklist[0]["uuid"];

		// Daten vereinheitlichen
		if ("album" in this.activeAlbum) { this.activeAlbum["title"] = this.activeAlbum["album"]; }

		// initial load of metadata
		this.update();

		// set control vizualisation
		var thisApp   = this;
		this.interval = setInterval(function(){thisApp.musicStatus();},1000);

		document.getElementById("jcPlayer_tr_progress").style.visibility = "visible";
		}

	// update data
	this.update = function() {
		playerApp       = this;

		var active      = this.activeTrack;
		var active_id   = this.activeTracklist[active];
		var active_info = this.activeTracks[active_id];
		var active_img  = this.activeAlbum["cover_image"]; // doesn't work any more

		// load audio file
		this.audio.src 			= this.url + active_info["file"];
  		this.audio.style.display 	= "none"; 	//added to fix ios issue
  		this.audio.autoplay 		= false; 	//avoid the user has not interacted with your page issue
  		this.audio.onended = function(){
			console.log(playerApp.activeTrack+" < "+(playerApp.activeSize-1));
			if (playerApp.activeTrack < playerApp.activeSize-1)	{ playerApp.next(); }		// play next, if not last
			else                                           		{ playerApp.audio.remove(); } 	// remove after playing to clean the Dom
  			};

		// further parameter that might be interesting (see also https://www.w3schools.com/tags/ref_av_dom.asp)
		// - .duration
		// - .currentTime
		// - .volume
		// - .paused
		// - .played

		if (this.activeAlbum["title"] == "") { this.activeAlbum["title"] = "<i>No title loaded ...</i>"; }

		// write data
		this.setTextById("jcPlayer_"+this.appName+"_title",	"<b>" + this.activeAlbum["title"] + "</b>");
		this.setTextById("jcPlayer_"+this.appName+"_track",	active_info["title"] + " &nbsp; [" + (this.activeTrack+1) + "/" + this.activeSize + "]");
		this.setTextById("jcPlayer_"+this.appName+"_file",	active_info["file"]);

		if (this.activeCtrl["info_cover"]) {
			if (active_img) {
				var cover = document.getElementById("jcPlayer_"+this.appName+"_cover");
				cover.style.backgroundImage  = "url('" + this.url_c + active_img + "')"; 
				cover.style.backgroundRepeat = "no-repeat";
				cover.style.backgroundSize   = "contain";
				}
			else if (altern_img) {
				var cover = document.getElementById("jcPlayer_"+this.appName+"_cover");
				cover.style.backgroundImage  = "url('" + this.url + altern_img + "')"; 
				cover.style.backgroundRepeat = "no-repeat";
				cover.style.backgroundSize   = "contain";
			}	}

		}

	this.musicStatus = function() {
		var date     	= new Date();
		var text     	= "";
		var progress 	= this.audio.currentTime / this.audio.duration * 100;
		var timeleft_o 	= this.audio.duration - this.audio.currentTime;
		var timeleft_m  = Math.floor( timeleft_o / 60 );
		var timeleft_s  = Math.round( timeleft_o - (timeleft_m * 60) - 1);
		if (timeleft_s < 10) { timeleft_s = "0" + timeleft_s; }
		var timeleft    = timeleft_m + ":" + timeleft_s;

		//this.setTextById("jcPlayer_"+this.appName+"_playlist", progress );
		if (document.getElementById("jcPlayer_progress")) {
			document.getElementById("jcPlayer_progress").style.width = progress+"%";
			}

		if (timeleft.indexOf(":") > 0) 	{ this.setTextById("jcPlayer_progresstime", "[ -"+timeleft+" ]"); }
		else				{ this.setTextById("jcPlayer_progresstime", "[ -x:xx ]"); }

		this.activeCtrl["id_album"] = this.activeAlbum["uuid"];
		this.activeCtrl["id_track"] = this.activeTracklist[this.activeTrack];
		//console.log("TEST:" +this.activeCtrl["id_album"] + this.activeCtrl["id_track"] );
		}


	// play and navigate
	this.play  = function() 	{ this.audio.play(); this.playing = 1;}
	this.pause = function() 	{
		if (this.playing > 0) 	{ this.audio.pause(); this.playing = 0; }
		else			{ this.audio.play();  this.playing = 1; }
		}
	this.stop  = function() 	{ this.update(); this.audio.pause(); this.playing = 0; }
	this.next  = function() 	{ if (this.activeTrack < this.activeSize-1) {this.activeTrack++;} this.update(); this.audio.play(); }
	this.last  = function() 	{ if (this.activeTrack > 0)                 {this.activeTrack--;} this.update(); this.audio.play(); }

	// volume control ...
	this.volumeSet  = function(vol)	{ this.audio.volume = vol; this.volume = vol; console.log("jcPlayer: Set vol - "+vol)}
	this.volumeUp   = function()	{ if (this.volume < 1)  { this.volume += 0.05; } this.volumeSet(this.volume); }
	this.volumeDown = function()	{ if (this.volume > 0)  { this.volume -= 0.05; } this.volumeSet(this.volume); }
	this.volumeMute = function()	{ if (this.audio.muted) { this.audio.muted = false; } else { this.audio.muted = true; } }

	// sort playlist
	this.sort_list = function(tracks) {
                var sort_t    = [];
                var album     = {};
		var tracklist = [];
		var a         = 0;
                for (var x in tracks) {
                        //console.log(tracks[x]["track_num"][0] + "_" + tracks[x]["uuid"]);
                        var mykey = tracks[x]["track_num"][0];
                        sort_t.push(mykey);
                        album[mykey] = tracks[x]["uuid"];
			a++;
                        }
                sort_t.sort(this.sortNumber);

                count = 0;
                for (var key in sort_t) {
			tracklist.push(album[sort_t[key]]);
                        }
		return tracklist;
		}

	// helping functions ...
	this.sortNumber = function(a,b) { return a - b; }
	this.setTextById = function(id,text) {
		if (document.getElementById(id)) 	{ document.getElementById(id).innerHTML = text; }
		else					{ console.error("jcPlayer: ERROR setTextById - "+id); }
		}

	// End Of App
	}

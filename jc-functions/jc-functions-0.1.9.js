//-------------------------
// jc://functions/
//-------------------------

var jc_functions_name    = "jc://functions/";
var jc_functions_version = "v0.1.8.1";


// call different commands for left and right mousebutton
//-----------------------------------------------------------
// usage: <div onmousedown="onmousedown_left_right(event,'alert(#left#);','alert(#right#);');" oncontextmenu="return false;">CLICK</div>

function onmousedown_left_right(event,command_left,command_right) {

        left   = 0;
        middle = 1; // not implemented yet
        right  = 2;

        if(event.button === left)           { eval(command_left.replace(/#/g, "\"")); }
        else if(event.button === right)     { eval(command_right.replace(/#/g, "\"")); }
        }

//--------------------------------
// convert seconds to time format
//--------------------------------

function convert_second2time(seconds_input) {

	var seconds = seconds_input;
	var hours   = Math.floor(seconds/60/60);	seconds = seconds - hours*60*60;
	var minutes = Math.floor(seconds/60);		seconds = seconds - minutes*60;
	var sec     = seconds;

	if (sec < 10)                   { sec     = "0"+sec; }
	if (minutes < 10 && hours > 0)  { minutes = "0"+minutes; }

	if (hours > 0)                  { return (hours+":"+minutes+":"+sec); }
	else                            { return (minutes+":"+sec); }
	}

//--------------------------------
// css class functions
//--------------------------------

function cssClassAdd(id, add)		{ cssClassChange(id=iid, from="", to=add); }
function cssClassRemove(id, remove)	{ cssClassChange(id=iid, from=remove, to=""); }

function cssClassChange(id, from="", to="") {
	if (document.getElementById(id)) {
		if (from != "") { document.getElementById(id).classList.remove(from); }
		if (to != "")   { document.getElementById(id).classList.add(to); }
		}
	else { console.warn("changeClass: No element with id "+id+" found."); }
	}

function cssClassExists(id, check) {
	if (document.getElementById(id).classList.contains(check)) 	{ return true; }
	else								{ return false; }
	}


//--------------------------------
// set & get text to element
//--------------------------------

function setValueById(id, text, logging=false) {
    if (document.getElementById(id) == document.activeElement) {
        if (logging) { console.debug("Element active, will not change value: "+id+" (setValueById)"); }
        return;
        }
  	if (document.getElementById(id))      { document.getElementById(id).value = text; }
  	else if (logging)                     { console.debug("Element not found: "+id+" (setValueById)"); }
  	}

function getValueById(id, text, logging=false) {
  	if (document.getElementById(id))      { return document.getElementById(id).value; }
  	else if (logging)                     { console.debug("Element not found: "+id+" (getValueById)"); }
  	}

//--------------------------------
// set & get text to element
//--------------------------------

function setTextById(id, text, logging=false) {
  	if (document.getElementById(id))      { document.getElementById(id).innerHTML = text; }
  	else if (logging)                     { console.debug("Element not found: "+id+" (setTextById)"); }
  	}

function getTextById(id, text, logging=false) {
  	if (document.getElementById(id))      { return document.getElementById(id).innerHTML; }
  	else if (logging)                     { console.debug("Element not found: "+id+" (getTextById)"); }
  	}

function addTextById(id, text="", logging=false) {
	if (document.getElementById(id))      { document.getElementById(id).innerHTML += text; }
	else                                  { console.error("Element not found: "+id+" (addTextById)"); }
	}

function setOnclickById(id, script="") {
	if (document.getElementById(id)) {
		document.getElementById(id).onclick = function() { eval(script); };
		if (script == "") 	{ document.getElementById(id).style.cursor = "default"; }
		else			    { document.getElementById(id).style.cursor = "pointer"; }
		}
	else { console.error("setOnClickById: ERROR Element not found - "+id); }
	}

function copyTextById(id, info=undefined, info_text="") {
	if (document.getElementById(id)) {
	    text = document.getElementById(id).innerHTML;
        navigator.clipboard.writeText(text)
            .then(console.debug('copyTextById(): Copied!'))
            .catch(console.error);
        if (info && text === "") { info.info("Copied!"); }
        else if (info)           { info.info(info_text); }
        }
	else {
	    console.error("Element not found: "+id+" (copyTextById)");
	    }
	}

function copyValueById(id, info=undefined, info_text="") {
	if (document.getElementById(id))      {
	    text = document.getElementById(id).value;
        navigator.clipboard.writeText(text)
            .then(console.debug('copyTextById(): Copied!'))
            .catch(console.error);
        if (info && text === "") { info.info("Copied!"); }
        else if (info)           { info.info(info_text); }
    }
	else {
	    console.error("Element not found: "+id+" (copyValueById)");
        }
    }


//--------------------------------

function check_if_element_or_value(name_value,lowercase=false) {

    if (name_value == "")  { console.error("check_if_element_or_value: no value"); return; }

	if (document.getElementById(name_value) && document.getElementById(name_value).value) 	{
		if (lowercase)     { return document.getElementById(name_value).value.toLowerCase(); }
		else               { return document.getElementById(name_value).value; }
		}
	else                   { return name_value; }
	}


//--------------------------------
// height / width ....
//--------------------------------

function pageHeight() {
	var body = document.body;
	var html = document.documentElement;

	var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	return (height);
	}

//--------------------------------
// check if element is hidden
//--------------------------------

function isHidden(id) {
  if (document.getElementById(id))      {
          var element = document.getElementById( id );
          var style   = window.getComputedStyle( element );
          return (style.display == 'none');
          }
  else { console.debug("Element not found: "+id+" (isHidden)"); }
  }

//--------------------------------
// change visibility of element
//--------------------------------

function elementHidden(id,debug="") {
  if (document.getElementById(id))      { document.getElementById(id).style.display = "none"; }
  else                                  { console.debug("Element not found: "+id+" (elementHidden)"); }
  }

function elementVisible(id, type="block") {
  if (document.getElementById(id))      { document.getElementById(id).style.display = type; }
  else                                  { console.debug("Element not found: "+id+" (elementVisible)"); }
  }

function changeVisibility(id, show="", type="block") {
	if (show == "") {
		if (isHidden(id))  { elementVisible(id, type); }
		else               { elementHidden(id); }
		}
	else if (show == true)	   { elementVisible(id, type); }
	else if (show == false)    { elementHidden(id); }
  }


//--------------------------------------

function writeKeyBoard () {
   var test = "<ul>";
   for (var i=8500;i<15000;i++) {
       test = test + "<li>" + i + " &nbsp; [ &#"+i+"; ]</li>";
       }
   test = test + "</ul>";
   return test;
   }

//--------------------------------
// sort dictionary
//--------------------------------

function sortDict(dict,sort_key) {

	var sortAsNumber = false;
	var order        = [];
	var sorted       = {};

	for (key in dict) {
		sorted[dict[key][sort_key]] = key;
		if (Number.isInteger(dict[key][sort_key])) { sortAsNumber = true; }
		}

	var order_key  = Object.keys(sorted);
	if (sortAsNumber)   { order_key.sort(sortNumber); }
	else                { order_key.sort(); }

	for (var i=0;i<order_key.length;i++) {
		order.push(sorted[order_key[i]]);
		}

	return order;
	}

function sortDictByValue(dict) {
	var order      = [];
	var sort_order = [];

	for (key in dict) { sort_order.push(dict[key] + "###" + key); }
	sort_order.sort();
	for (var i=0;i<sort_order.length;i++) {
		var key = sort_order[i].split("###");
		order.push(key[1]);
		}
	return order;
	}

function dict_size(d) {
	var c=0;
	for (var i in d) {c++;}
	return c;
	}

function sortNumber(a,b) {
        return a - b;
    }

//--------------------------------
// table
//--------------------------------

function jcTable(name) {

	this.table_id       = name;
	this.table_heigth   = "";
	this.table_width    = "";
	this.table_border   = "0";
	this.cells_width    = [];
	this.columns        = 1;
	this.vertical_align = "top";

	console.log("Create jcTable ["+name+"] ...");

	this.start	= function () { return "<table id=\"" + this.table_id + "\" border=\"" + this.table_border + "\" width=\"" + this.table_width + "\" height=\"" + this.table_height + "\">"; }
	this.end	= function () { return "</table>"; }
	this.row	= function (cells) {
		var width = "";
		var style = "";
		var text  = "<tr>";

		if (this.cells_width == []) 		{ cell_width = (100 / cells.length) + "%"; }
		for (var i=0;i<cells.length;i++) {
			if (this.cells_width != [])	{ width = this.cells_width[i]; }
			else				{ width = cell_width; }
			if (this.vertical_align != "") { style += "vertical-align:"+this.vertical_align+";"; }
			text += "<td width=\"" + width + "\" style=\"" + style + "\">" + cells[i] + "</td>";
			}
		text    += "</tr>";
		return text;
		}
    this.line	= function (text="") {
		return "<tr><td colspan='100'><hr style='border:1px solid white;opacity:50%;'/></td></tr>";
		}
	this.row_one	= function (cell) {
		return "<tr><td colspan=\""+this.columns+"\">" + cell + "</td></tr>";
		}
	}

//--------------------------------
// logging
//--------------------------------


function jcLogging(name) {

	this.app_name       = name;

	this.log      = function (message) {
		if (typeof message === 'string' || message instanceof String) { console.log(this.app_name   + ": " + message); }
		else { console.log(this.app_name   + ": "); console.log(message); }
		}
	this.default  = function (message) {
		if (typeof message === 'string' || message instanceof String) { console.log(this.app_name   + ": " + message); }
		else { console.log(this.app_name   + ": "); console.log(message); }
		}
	this.info     = function (message) {
		if (typeof message === 'string' || message instanceof String) { console.info(this.app_name   + ": " + message); }
		else { console.info(this.app_name   + ": "); console.info(message); }
		}
	this.warn     = function (message) {
		if (typeof message === 'string' || message instanceof String) { console.warn(this.app_name   + ": " + message); }
		else { console.warn(this.app_name   + ": "); console.warn(message); }
		}
	this.warning  = function (message) {
		if (typeof message === 'string' || message instanceof String) { console.warn(this.app_name   + ": " + message); }
		else { console.warn(this.app_name   + ": "); console.warn(message); }
		}
	this.debug    = function (message) {
		if (typeof message === 'string' || message instanceof String) { console.debug(this.app_name   + ": " + message); }
		else { console.debug(this.app_name   + ": "); console.debug(message); }
		}
	this.error    = function (message) {
		if (typeof message === 'string' || message instanceof String) { console.error(this.app_name   + ": " + message); }
		else { console.error(this.app_name   + ": "); console.error(message); }
		}
	}

//--------------------------------
// tool tip
//--------------------------------

function jcTooltip(name) {

	console.log("Create jcTooltip ["+name+"] ...");

	this.appName       = name;
	this.react_on      = "onmouseover";
	this.style_tooltip = "";
	this.style_offset  = ["","",""];
	this.all_elements  = [];

	this.settings = function (mode="onmouseover", width="auto", height="auto", offset_height=0, offset_width=0, triangle_position="right") {

		triangle_position = "right";

		if (triangle_position == "left" || triangle_position == "upper-left") {
			right = offset_width + width - 30;
			}
		else if (triangle_position == "right" || triangle_position == "upper-right") {
			right = offset_width + 20;
			}

		this.style_offset  = [
		    "bottom:unset;top:"+offset_height+"px;right:"+offset_width+"px;left:unset;",        // text container
		    "bottom:auto;top:"+(offset_height-9)+"px;right:"+right+"px;left:unset;",            // triangle 1
		    "bottom:unset;top:"+(offset_height-10)+"px;right:"+right+"px;left:unset;"           // triangle 2
		    ];
		this.style_tooltip = "height:"+height+"px;width:"+width+"px;"+this.style_offset[0];     // text container
		this.react_on      = mode;
		}

	this.create   = function (parent_element, tooltip_text, name, left="") {
		var react_on_cmd = "";
		var style_tt     = this.style_tooltip;
		this.all_elements.push(name);

		if (this.react_on == "onmouseover")  { react_on_cmd = "onmouseover=\""+this.appName+".show('"+name+"');\" onmouseout=\""+this.appName+".hide('"+name+"');\""; }
		else if (this.react_on == "onclick") { react_on_cmd = "onclick=\""+this.appName+".toggle('"+name+"');\""; }
		else if (this.react_on == "other")   {}  // external activation

		var float = "left";
		if (left == "left") { float = "clear"; }
		var text  = "";
	        text += "<span class='jc_tooltip' "+react_on_cmd+" style='float:"+float+";'>";
	        text += parent_element;
	        text += "<span class='jc_triangle1' id=\"jc_triangle1_" + name + "\" style=\""+this.style_offset[1]+"\"></span>";
        	text += "<span class='jc_triangle2' id=\"jc_triangle2_" + name + "\" style=\""+this.style_offset[2]+"\"></span>";
	        text += "<span class=\"jc_tooltiptext " + left + "\" id=\"jc_tooltiptext_" + name + "\" style=\""+style_tt+"\">" + tooltip_text + "</span>";
        	text += "</span>";
		return text;
		}

	this.create_inside     = function (parent_element, tooltip_text, name, left="") {

		var react_on_cmd = "";
		var style_tt     = this.style_tooltip;
		this.all_elements.push(name);

		if (this.react_on == "onmouseover")  { react_on_cmd = "onmouseover=\""+this.appName+".show('"+name+"');\" onmouseout=\""+this.appName+".hide('"+name+"');\""; }
		else if (this.react_on == "onclick") { react_on_cmd = "onclick=\""+this.appName+".toggle('"+name+"');\""; }
		else if (this.react_on == "other")   {}  // external activation

		var parent_element_type = parent_element.substring(parent_element.indexOf("<")+1, parent_element.indexOf(" "));

        if (tooltip_text.replaceAll) {
            tooltip_text = tooltip_text.replaceAll("<button", "<tooltip-button");
            tooltip_text = tooltip_text.replaceAll("</button", "</tooltip-button");
            }

        var text = "";
        parts    = parent_element.split(">");

        if (parts[0].indexOf("style=") > -1) {
            text  = parent_element.replace("<"+parent_element_type, "<" + parent_element_type + " " + react_on_cmd + " ");
            text  = text.replace("style=\"", "style=\"overflow:visible;");
            text  = text.replace("style='", "style='overflow:visible;");
		    }
		else {
		    text  = parent_element.replace("<"+parent_element_type, "<" + parent_element_type + " " + react_on_cmd + " style=\"overflow:visible;\" ");
		    }
		text     = text.replace("</"+parent_element_type+">", "");
        text    += "<span class='jc_tooltip' style='float:left;width:100%'>";
        text    += "  <span class='jc_triangle1' id=\"jc_triangle1_" + name + "\" style=\""+this.style_offset[1]+"\"></span>";
        text    += "  <span class='jc_triangle2' id=\"jc_triangle2_" + name + "\" style=\""+this.style_offset[2]+"\"></span>";
        text    += "  <span class=\"jc_tooltiptext " + left + "\" id=\"jc_tooltiptext_" + name + "\"  style=\""+style_tt+"\">" + tooltip_text + "</span>";
        text    += "</span>";
        text    += "</"+parent_element_type+">";
		return text;

		}

	this.create_right_left = function (parent_element, tooltip_text, name, left="") {
		}

	this.show = function (name) {
		elementVisible("jc_triangle1_" + name);
		elementVisible("jc_triangle2_" + name);
		elementVisible("jc_tooltiptext_" + name);
		}
		
	this.hide = function (name) {
		elementHidden("jc_triangle1_" + name);
		elementHidden("jc_triangle2_" + name);
		elementHidden("jc_tooltiptext_" + name);
		}
		
	this.toggle = function (name) {
		changeVisibility("jc_triangle1_" + name);
		changeVisibility("jc_triangle2_" + name);
		changeVisibility("jc_tooltiptext_" + name);
		//alert(document.getElementById("jc_tooltiptext_" + name).clientHeight);
		}
		
	this.toggleAll = function (name) {
		changeVisibility("jc_triangle1_" + name);
		changeVisibility("jc_triangle2_" + name);
		changeVisibility("jc_tooltiptext_" + name);
		
		for (var i=0;i<this.all_elements.length;i++) {
			if (this.all_elements[i] != name) {
				elementHidden("jc_triangle1_" + this.all_elements[i]);	
				elementHidden("jc_triangle2_" + this.all_elements[i]);
				elementHidden("jc_tooltiptext_" + this.all_elements[i]);		
			}	}
		//alert(document.getElementById("jc_tooltiptext_" + name).clientHeight);
		}
	}

//--------------------------------
// Syntax Highlighting
//--------------------------------

function syntaxHighlightJSON(json) {
    if (json == undefined) {
        console.log("syntaxHighlightJSON: got empty value for json.")
        return;
    }
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    else {
        try         { json = JSON.parse(json); json = JSON.stringify(json, undefined, 2); }
        catch(e)    { return json; }
        }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

module_scripts_loaded += 1;

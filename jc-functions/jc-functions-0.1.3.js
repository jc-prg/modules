//-------------------------
// jc://functions/
//-------------------------
// (c) Christoph Kloth
//-------------------------
/* INDEX:
function onmousedown_left_right(event,command_left,command_right) {
function convert_second2time(seconds) {
function setValueById(id, text) {
function getValueById(id, text) {
function setTextById(id, text) {
function getTextById(id, text) {
function addTextById(id, text="") {
function setOnclickById(id, script="") {
function isHidden(id) {
function elementHidden(id,debug="") {
function elementVisible(id) {
function changeVisibility(id) {
function writeKeyBoard () {
function sortDict(dict,sort_key) {
function sortDictByValue(dict) {
function sortNumber(a,b) {
function jcTooltip(name) {
	this.settings = function (mode="onmouseover", width="auto", height="auto", offset="") {
	this.create   = function (parent_element, tooltip_text, name, left="") {
	this.show = function (name) {
	this.hide = function (name) {
	this.toggle = function (name) {
	this.toggleAll = function (name) {
function check_if_element_or_value(name_value) {
*/
//-------------------------


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
	
	if (sec < 10)			{ sec     = "0"+sec; }
	if (minutes < 10 && hours > 0)	{ minutes = "0"+minutes; }
	
	if (hours > 0)			{ return (hours+":"+minutes+":"+sec); }
	else				{ return (minutes+":"+sec); }
	}

//--------------------------------
// set & get text to element
//--------------------------------

function setValueById(id, text) {
  	if (document.getElementById(id))      { document.getElementById(id).value = text; }
  	else                                  { console.debug("Element not found: "+id+" (setValueById)"); }
  	}

function getValueById(id, text) {
  	if (document.getElementById(id))      { return document.getElementById(id).value; }
  	else                                  { console.debug("Element not found: "+id+" (getValueById)"); }
  	}

//--------------------------------
// set & get text to element
//--------------------------------

function setTextById(id, text) {
  	if (document.getElementById(id))      { document.getElementById(id).innerHTML = text; }
  	else                                  { console.debug("Element not found: "+id+" (setTextById)"); }
  	}

function getTextById(id, text) {
  	if (document.getElementById(id))      { return document.getElementById(id).innerHTML; }
  	else                                  { console.debug("Element not found: "+id+" (getTextById)"); }
  	}
  
function addTextById(id, text="") {
	if (document.getElementById(id))	{ document.getElementById(id).innerHTML += text; }
	else 					{ console.error("Element not found: "+id+" (addTextById)"); }
	}

function setOnclickById(id, script="") {
	if (document.getElementById(id)) {
		document.getElementById(id).onclick = function() { eval(script); };
		if (script == "") 	{ document.getElementById(id).style.cursor = "default"; }
		else			{ document.getElementById(id).style.cursor = "pointer"; }
		}
	else { console.error("setOnClickById: ERROR Element not found - "+id); }
	}


//--------------------------------
// height / width ....
//--------------------------------

function pageHeight() {
	var body = document.body;
	var html = document.documentElement;
	
	var height = Math.max(	body.scrollHeight, body.offsetHeight,
				html.clientHeight, html.scrollHeight, html.offsetHeight );
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
  else                                  { console.debug("Element not found: "+id+" (isHidden)"); }
  }

//--------------------------------
// change visibility of element
//--------------------------------

function elementHidden(id,debug="") {
  if (document.getElementById(id))      { document.getElementById(id).style.display = "none"; }
  else                                  { console.debug("Element not found: "+id+" (elementHidden)"); }
  }

function elementVisible(id) {
  if (document.getElementById(id))      { document.getElementById(id).style.display = "block"; }
  else                                  { console.debug("Element not found: "+id+" (elementVisible)"); }
  }

function changeVisibility(id,show="") {
	if (show == "") {
		if (isHidden(id))  { elementVisible(id); }
		else               { elementHidden(id); }
		}
	else if (show == true)	   { elementVisible(id); }
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
	if (sortAsNumber) 	{ order_key.sort(sortNumber); }
	else			{ order_key.sort(); }

	for (var i=0;i<order_key.length;i++) {
		order.push(sorted[order_key[i]]);
		}
				
	return order;
	}
	
//--------------------------------------

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



//--------------------------------------

function sortNumber(a,b) {
        return a - b;
    }

//--------------------------------
// tool tip
//--------------------------------

function jcTooltip(name) {

	console.log("Start jcTooltip ["+name+"] ...");

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
			
		this.style_offset  = [ "bottom:unset;top:"+offset_height+"px;right:"+offset_width+"px;left:unset;", "bottom:auto;top:"+(offset_height-9)+"px;right:"+right+"px;left:unset;","bottom:unset;top:"+(offset_height-10)+"px;right:"+right+"px;left:unset;" ]; 
		this.style_tooltip = "style=\"height:"+height+"px;width:"+width+"px;"+this.style_offset[0]+"\"";
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
	        text += "<span class=\"jc_tooltiptext " + left + "\" id=\"jc_tooltiptext_" + name + "\" "+style_tt+">" + tooltip_text + "</span>";
        	text += "</span>";
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

function check_if_element_or_value(name_value,lowercase=false) {
        if (name_value == "")										{ console.error("check_if_element_or_value: no value"); return; }
	if (document.getElementById(name_value) && document.getElementById(name_value).value) 	{ 
		if (lowercase)	{ return document.getElementById(name_value).value.toLowerCase(); }
		else 		{ return document.getElementById(name_value).value; }
		}
	else					                                                { return name_value; }
	}


//--------------------------------
// EOF

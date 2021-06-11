//-------------------------
// jc://functions/
//-------------------------
// (c) Christoph Kloth
//-------------------------
/* INDEX:
function onmousedown_left_right(event,command_left,command_right)
function setTextById(id, text)
function getTextById(id, text)
function isHidden(id)
function elementHidden(id,debug="")
function elementVisible(id)
function changeVisibility(id)
function jcTooltip(name)
	this.settings = function (mode="onmouseover", width="auto", height="auto", offset="")
	this.create   = function (parent_element, tooltip_text, name, left="")
	this.show = function (name)
	this.hide = function (name)
	this.toggle = function (name)
	this.toggleAll = function (name)
*/
//--------------------------------------


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
  else                                  { console.debug("Element not found: "+id)+" (elementVisible)"; }
  }

function changeVisibility(id) {
  if (isHidden(id))  { elementVisible(id); }
  else               { elementHidden(id); }
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
	
	this.settings = function (mode="onmouseover", width="auto", height="auto", offset="") {
	
		if (offset != "") { this.style_offset  = [ "bottom:auto;top:"+offset+"px;", "bottom:auto;top:"+(offset-9)+"px;","bottom:auto;top:"+(offset-10)+"px;" ]; }
		
		this.style_tooltip = "style=\"height:"+height+";width:"+width+";"+this.style_offset[0]+"\"";
		this.react_on      = mode;
		} 
	
	this.create   = function (parent_element, tooltip_text, name, left="") {
		var react_on_cmd = "";
		var style_tt     = this.style_tooltip;
		this.all_elements.push(name);
	
		if (this.react_on == "onmouseover")  { react_on_cmd = "onmouseover=\""+this.appName+".show('"+name+"');\" onmouseout=\""+this.appName+".hide('"+name+"');\""; }
		else if (this.react_on == "onclick") { react_on_cmd = "onclick=\""+this.appName+".toggle('"+name+"');\""; }
		else if (this.react_on == "other")   {}  // external activation
	
		var text = "";
	        text += "<span class='jc_tooltip' "+react_on_cmd+" style='float:left;'>";
	        text += parent_element;
	        text += "<span class='jc_triangle1' id=\"jc_triangle1_" + name + "\" style=\""+this.style_offset[1]+"\"></span>";
        	text += "<span class='jc_triangle2' id=\"jc_triangle2_" + name + "\" style=\""+this.style_offset[2]+"\"></span>";
	        text += "<span class=\"jc_tooltiptext " + left + "\" id=\"jc_tooltiptext_" + name + "\" "+style_tt+">" + tooltip_text + "</span>";
        	text += "</span>";
		return text;
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



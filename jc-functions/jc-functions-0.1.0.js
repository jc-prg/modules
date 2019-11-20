//-------------------------
// jc://functions/
//-------------------------
// (c) Christoph Kloth
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




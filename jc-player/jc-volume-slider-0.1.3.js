//-----------------------------------------
// jc://volume-slider/
//-----------------------------------------
// slider for volume control
// requires jc-volume-slider-<version>.css
//-----------------------------------------


function jcSlider ( name, container ) {

    this.appName      = name;
    this.appContainer = container;
    this.appVersion   = "v0.1.3";
    this.callOnChange = this.info;
    this.showVolume   = this.info;

    // default position
    this.posBottom = false;
    this.posTop    = "50px";
    this.posLeft   = false;
    this.posRight  = "10px";

    // set callback functions
    this.setOnChange    = function(callOnChange="") {
        if (callOnChange != "") { this.callOnChange = callOnChange; }
        else                    { this.callOnChange = this.info; }
        }

    this.setShowVolume    = function(showVolume="") {
        if (showVolume != "")   { this.showVolume = showVolume; }
        else                    { this.showVolume = this.info;  }
        }

    // initial callback functions (info via alert)
    this.setOnChange();
    this.setShowVolume();

    // initialize slider
    this.init        = function( min, max, label ) {
        name = this.appName;

        if (this.container == undefined) {
            this.create_sliderHTML(name, label, min, max);
            this.container              = document.getElementById(this.appContainer);
            this.container.innerHTML    = this.sliderHTML;
            this.slider                 = document.getElementById(name);
            if (this.slider) {
                this.slider_value         = document.getElementById(name+"_value");
                this.slider_cont          = document.getElementById(name+"_container");
                this.slider_label         = document.getElementById(name+"_label");
                this.slider_active        = false;
                }
            else {
                console.error(this.appName+": No <DIV ID='"+name+"'> found!");
                }

            this.container.style.position   = "fixed";
            this.container.style.zIndex     = 98;

            if (this.posBottom != false)    { this.container.style.bottom = this.posBottom; }     else { this.container.style.bottom = ""; }
            if (this.posTop    != false)    { this.container.style.top    = this.posTop; }        else { this.container.style.top    = ""; }
            if (this.posLeft   != false)    { this.container.style.left   = this.posLeft; }        else { this.container.style.left = ""; }
            if (this.posRight  != false)    { this.container.style.right  = this.posRight; }     else { this.container.style.right = ""; }

            }
        else {
            document.getElementById(this.appName).setAttribute("min", min);
            document.getElementById(this.appName).setAttribute("max", max);
            }

        this.slider_value.innerHTML    = this.slider.value;
        this.slider_label.innerHTML    = "Device: " + label;

        this.audioMin             = min;
        this.audioMax             = max;

        // create link from vars and functions into slider for use in the events
        this.slider.slider_value    = this.slider_value;
        this.slider.slider_active   = this.slider_active;
        this.slider.showVolume      = this.showVolume;
        this.slider.callOnChange    = this.callOnChange;

        // define slider events
        this.slider.oninput         = function( ) {
            console.debug("Set Volume: " + this.value);
            this.slider_value.innerHTML = this.value;
            this.showVolume( this.value );
            }

        this.slider.onmousedown      = function() { this.slider_active = true; }
        this.slider.onmouseup        = function() {
            this.callOnChange( this.value );
            this.slider_active = false;
            }

        this.slider.ontouchstart     = function() {    this.slider_active = true;}
        this.slider.ontouchend       = function() {
            this.callOnChange( this.value );
            this.slider_active = false;
            }
        }

    // create slider HTML
    this.create_sliderHTML    = function(name, label, min, max) {
        this.sliderHTML           =  "<div id=\""+name+"_container\" class=\"slidecontainer\" style=\"display:none\">";
        this.sliderHTML           += "<input type=\"range\" min=\""+min+"\" max=\""+max+"\" value=\"50\" class=\"slider\" id=\""+name+"\">";
        this.sliderHTML           += "<br/><div id=\""+name+"_value\" class=\"slidervalue\">xx</div>";
        this.sliderHTML           += "<div  id=\""+name+"_label\" class=\"sliderlabel\">"+label+"</div>";
        this.sliderHTML           += "</div>";
        return this.sliderHTML;
        }

    // set position of slider (if not default)
    this.setPosition    = function(top=false,bottom=false,left=false,right=false) {
        this.posBottom  = bottom;
        this.posTop     = top;
        this.posLeft    = left;
        this.posRight   = right;
        console.log(this.appName+".setPosition (jcSlider): top="+top+", bottom="+bottom+", left="+left+", right="+right+".");
        }


    // set audioMax
    this.setAudioMax    = function(max) {
        document.getElementById(this.appName).setAttribute("max", max);
        }

    // set value from outside (update data)
    this.set_value      = function( value ) {
        if (this.slider) {
            if (this.slider_active == false) {
                this.slider.value           = value;
                this.slider_value.innerHTML = value;
                }
            console.debug("Set Volume: " + this.slider.value);
            }
        else {
            console.error(this.appName+": No slider created yet!");
            }
        }

    // show or hide slider
    this.show_hide        = function() {

        this.container.style.position = "fixed";

        if (this.posBottom != false)    { this.container.style.bottom = this.posBottom; }   else { this.container.style.bottom = ""; }
        if (this.posTop    != false)    { this.container.style.top    = this.posTop; }      else { this.container.style.top    = ""; }
        if (this.posLeft   != false)    { this.container.style.left   = this.posLeft; }     else { this.container.style.left = ""; }
        if (this.posRight  != false)    { this.container.style.right  = this.posRight; }    else { this.container.style.right = ""; }

        if (this.slider_cont.style.display == "none")     { this.slider_cont.style.display = "block"; }
        else                                              { this.slider_cont.style.display = "none"; }
        }

    this.info        = function() {
        alert("Please define a function to be called on change.");
        }

    }

module_scripts_loaded += 1;

















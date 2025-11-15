//--------------------------------
// jc://modules/
//--------------------------------

console.log("jc://modules/v1.2.1")

module_scripts_loaded = 0;

modules_js = [
    "jc-app/jc-app-1.5.0.js",
    "jc-cookie/jc-cookie.js",
    "jc-functions/jc-functions-0.1.9.js",
    "jc-cookie/jc-cookie-auth.js",
    "jc-msg/jc-msg-1.1.9.js",
    "jc-player/jc-player-0.1.7.js",
    "jc-player/jc-volume-slider-0.1.3.js",
    "jc-upload/upload.js",
    ];

modules_css = [
    "jc-functions/jc-functions-0.1.9.css",
    "jc-msg/jc-msg-1.1.9.css",
    "jc-player/jc-player-0.1.7.css",
    "jc-player/jc-volume-slider-0.1.3.css",
    "jc-upload/upload.css",
    ];

function modules_loaded() {
    if (module_scripts_loaded == modules_js.length) { return true; }
    else                                            { return false; }
    }

function loadScripts(location, load_scripts, fresh_load=false) {
    for (var i=0;i<load_scripts.length;i++) {
        // check for existing script
        var script = load_scripts[i];
        var js = document.getElementById(script);
        if (js != null) {
            document.body.removeChild(js);
            console.log("--- loadScript: remove " + script);
        }

        // load script
        date_id = new Date().getTime();
        js = document.createElement("script");
        if (fresh_load) { js.src = location + script + "?" + date_id; }
        else            { js.src = location + script; }
        js.id  = script;
        document.body.appendChild(js);
        js = null;

        var check = document.getElementById(script);
        if (check == null)  { console.log("--- loadScript: failed to load " + location + script); } // + "?" + date_id); }
        else                { console.log("--- loadScript: load " + location + script); } // + "?" + date_id); }
    }
}

function loadCss(location, load_css, fresh_load=false) {
    for (var i=0;i<load_css.length;i++) {
        // check if css loaded
        var css_link = load_css[i];
        var css_element = document.getElementById(css_link);
        if (css_element != null) {
            document.head.removeChild(css_element);
            console.log("--- loadScript: remove " + css_link);
        }
        // load css
        date_id = new Date().getTime();
        css_element = document.createElement("link");
        if (fresh_load) { css_element.href = location + css_link + "?" + date_id; }
        else            { css_element.href = location + css_link; }
        css_element.id = css_link;
        css_element.rel = "stylesheet";
        css_element.type = "text/css";
        css_element.media = "all";
        document.head.appendChild(css_element);
        console.log("--- loadCss: load " + location + css_link); // + "?" + date_id);
        css_element = null;
    }
}
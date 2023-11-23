//--------------------------------
// jc://modules/
//--------------------------------

modules_js = [
    "jc-app/jc-app-1.4.4.js",
    "jc-functions/jc-functions-0.1.6.js",
    "jc-cookie/jc-cookie.js",
    "jc-msg/jc-msg-1.1.7.js",
    "jc-player/jc-player-0.1.7.js",
    "jc-player/jc-volume-slider-0.1.2.js",
    "jc-upload/upload.js",
    ];

modules_css = [
    "jc-functions/jc-functions-0.1.5.css",
    "jc-msg/jc-msg-1.1.7.css",
    "jc-player/jc-player-0.1.7.css",
    "jc-player/jc-volume-slider-0.1.2.css",
    "jc-upload/upload.css",
    ];


function loadScripts(location, load_scripts) {
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
        js.src = location + script; // + "?" + date_id);
        js.id  = script;
        document.body.appendChild(js);
        js = null;

        var check = document.getElementById(script);
        if (check == null)  { console.log("--- loadScript: failed to load " + location + script); } // + "?" + date_id); }
        else                { console.log("--- loadScript: load " + location + script); } // + "?" + date_id); }
    }
}

function loadCss(location, load_css) {
    for (var i=0;i<load_css.length;i++) {
        // check if css loaded
        var css_link = load_css[i];
        var css_element = document.getElementById(css_link);
        if (css_element != null) {
            document.head.removeChild(js);
            console.log("--- loadScript: remove " + css_link);
        }
        // load css
        css_element = document.createElement("link");
        css_element.href = location + css_link;
        css_element.id = css_link;
        css_element.rel = "stylesheet";
        css_element.type = "text/css";
        css_element.media = "all";
        document.head.appendChild(css_element);
        console.log("--- loadCss: load " + location + css_link); // + "?" + date_id);
        css_element = null;
    }
}
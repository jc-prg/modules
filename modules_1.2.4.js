//--------------------------------
// jc://modules/
//--------------------------------

let modules_version = "v1.2.4";
let module_scripts_loaded = 0;

const modules_js = [
    "jc-app/jc-app-1.5.0.js",
    "jc-cookie/jc-cookie.js",
    "jc-functions/jc-functions-0.1.9.js",
    "jc-cookie/jc-cookie-auth.js",
    "jc-msg/jc-msg-1.1.9.js",
    "jc-player/jc-player-0.1.7.js",
    "jc-player/jc-volume-slider-0.1.3.js",
    "jc-upload/upload.js",
    ];
const modules_css = [
    "jc-functions/jc-functions-0.1.9.css",
    "jc-msg/jc-msg-1.1.9.css",
    "jc-player/jc-player-0.1.7.css",
    "jc-player/jc-volume-slider-0.1.3.css",
    "jc-upload/upload.css",
    ];

console.log("jc://modules/" + modules_version);


/* check if all scripts are loaded */
function modules_loaded() {
    return module_scripts_loaded === modules_js.length;
    }


/* load javascript files dynamically */
function loadScripts(location, load_scripts, fresh_load=false) {
    for (let i=0;i<load_scripts.length;i++) {
        // check for existing script
        let script = load_scripts[i];
        let js = document.getElementById(script);
        if (js !== null) {
            document.body.removeChild(js);
            console.log("--- loadScript: remove " + script);
        }

        // load script
        let date_id = new Date().getTime();
        js = document.createElement("script");
        if (fresh_load) { js.src = location + script + "?" + date_id; }
        else            { js.src = location + script; }
        js.id  = script;
        js.dataset.dynamic = 1;
        document.body.appendChild(js);
        js = null;

        let check = document.getElementById(script);
        if (check == null)  { console.log("--- loadScript: failed to load " + location + script); } // + "?" + date_id); }
        else                { console.log("--- loadScript: load " + location + script); } // + "?" + date_id); }
    }
}


/* load CSS files dynamically */
function loadCss(location, load_css, fresh_load=false) {
    for (let i=0;i<load_css.length;i++) {
        // check if css loaded
        let css_link = load_css[i];
        let css_element = document.getElementById(css_link);
        if (css_element !== null) {
            document.head.removeChild(css_element);
            console.log("--- loadScript: remove " + css_link);
        }
        // load css
        let date_id = new Date().getTime();
        css_element = document.createElement("link");
        if (fresh_load) { css_element.href = location + css_link + "?" + date_id; }
        else            { css_element.href = location + css_link; }
        css_element.id = css_link;
        css_element.rel = "stylesheet";
        css_element.type = "text/css";
        css_element.media = "all";
        css_element.dataset.dynamic = 1;
        document.head.appendChild(css_element);
        console.log("--- loadCss: load " + location + css_link); // + "?" + date_id);
        css_element = null;
    }
}


/* reload dynamically loaded javascript files */
function reloadScripts() {
    console.log("--- Reloading dynamic JS ---");
    const date_id = new Date().getTime();
    let count = 0;

    // Reload JS
    document.querySelectorAll("script[data-dynamic='1']").forEach(node => {
        // reload
        const src = node.src.split("?")[0];
        node.src = src + "?" + date_id;

        // add another version to overwrite existing scripts and values
        const s = document.createElement("script");
        s.src = src + "?" + date_id;
        document.body.appendChild(s);

        count++;
    });
    return count;
}


/* reload dynamically loaded CSS files */
function reloadCss() {
    console.log("--- Reloading dynamic CSS ---");
    const date_id = new Date().getTime();
    let count = 0;

    // Reload CSS
    document.querySelectorAll("link[data-dynamic='1']").forEach(node => {
        const href = node.href.split("?")[0];
        node.href = href + "?" + date_id;
        count++;
    });
    return count;
}


/* reload dynamically loaded javascript and CSS files */
function reloadScriptsAndCss() {
    let count = 0;
    count += reloadScripts();
    count += reloadCss();
    alert("Reloaded in total " + count + " CSS and JavaScript files!");
}

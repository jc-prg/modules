//-------------------------------------------------------
// UPLOAD SCRIPT
//-------------------------------------------------------
/* IMPLEMENTATION: to integrate add the following to HTML:

	<script src="upload/upload.js"></script>
      <div id="uploadform"></div>
      <script>
		defaultUpload("uploadform");
		enableUpload();
	</script>
*/
//-------------------------------------------------------
/* INDEX:
function defaultForm(dir="",type="")
function defaultUpload(id)
function enableUpload()
function allowDrop(ev)
function drag(ev)
function drop(ev)
function dateiauswahl(evt)
function dateiauswahl2(files)
			reader.onload = (function (theFile)
				return function (e)
function fileUpload(callback,param="")
    client.onerror = function(e)
    client.onload = function(e)
    client.upload.onprogress = function(e)
    client.onabort = function(e)
*/
//-------------------------------------------------------

var loaded        = false;
var UploadDateien = [];


//--------------------------
// Default form ...
//--------------------------

function defaultForm(dir="",type="") {

	var default_form = '<div id="uploadzone" class="droparea" ondrop="drop(event)" ondragover="allowDrop(event)"> \
        <small>Datei hierher ziehen:</small> \
        <output id="list"></output> \
</div> \
<div class="upload"> \
        <input type="file" id="files" name="files[]" /><br/>';

	if (dir != "") {
		default_form += '<input id="upload_dir" value="' + dir + '" />';
		default_form += '<input id="upload_type" value="' + type + '" />';
		}

	default_form += '<hr style="background:gray;height:1px;border:0px;margin:5px;" /> \
        <div class="uploadCol"> \
                <button id="uploadbutton" onclick="fileUpload();">upload</button><br/> \
                <progress id="progress" class="progressbar"></progress> <span id="prozent"></span> \
        </div> \
        <div class="uploadCol"> \
            <div id="fileName">Datei ausw&auml;hlen...</div> \
            <div id="fileSize"></div> \
            <div id="fileType"></div> \
	    <input id="fName" style="display:none;" /> \
        </div> \
</div> \
';
	return default_form;
	}


//--------------------------

function defaultUpload(id) {
	document.getElementById(id).innerHTML = default_form;
	}


//--------------------------
// Auf neue Auswahl reagieren und gegebenenfalls Funktion dateiauswahl neu ausführen.

function enableUpload() {
	document.getElementById('files').addEventListener('change', dateiauswahl, false);
	}


//--------------------------
// Drag & Drop
//--------------------------


function allowDrop(ev) {
        ev.preventDefault();
        }

function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        }

function drop(ev) {
        ev.preventDefault();
        var files =  ev.dataTransfer.files;
        var file  = [files[0]];
        dateiauswahl2(file);
        UploadDateien = file;

        if (file[1]) { alert("Upload nur Bild zur selben Zeit."); }
        //fileUpload(files);
        }


//--------------------------
// File select & preview
//--------------------------

function dateiauswahl(evt) {
		UploadDateien = evt.target.files; // FileList object
		dateiauswahl2(UploadDateien);
	}

//--------------------------

function dateiauswahl2(files) {
		//dateien = evt.target.files; // FileList object
		document.getElementById('list').innerHTML = "";
		UploadDateien = files;

		// Auslesen der gespeicherten Dateien durch Schleife
		for (var i = 0, f; f = UploadDateien[i]; i++) {

			loaded = true;

			// nur Bild-Dateien
			if (!f.type.match('image.*')) {
				continue;
			}

			var reader = new FileReader();
			reader.onload = (function (theFile) {
				return function (e) {
					// erzeuge Thumbnails.
					var vorschau = document.createElement('img');
					vorschau.className = 'vorschau';
					vorschau.src       = e.target.result;
					vorschau.title     = theFile.name;
					//document.getElementById('uploadzone').insertBefore(vorschau, null);
					document.getElementById('list').insertBefore(vorschau, null);
					document.getElementById('fileName').innerHTML = "File: "+theFile.name;
					document.getElementById('fName').value        = theFile.name;
					document.getElementById('fileSize').innerHTML = "Size: "+theFile.size;
					document.getElementById('fileType').innerHTML = "Type: "+theFile.type;

				};

			})(f);

			// Bilder als Data URL auslesen.
			reader.readAsDataURL(f);
		}
	}

//-------------------------
// File upload
//-------------------------

var client = null;

function fileUpload(callback,param="") {

	//console.log("callback: "+callback+"/"+param);

	//Wieder unser File Objekt

	if (typeof UploadDateien !== 'undefined' && UploadDateien[0]) {
		var file     = UploadDateien[0]; // document.getElementById("fileA").files[0];
		console.log("1:"+file["name"]);
		}
	else {
		callback(param);
		return;
		}
//	if (files) {
//		file = files[0]; 
//		console.log("2:"+file["name"]);
//		}

	//FormData Objekt erzeugen
	var formData = new FormData();
	//XMLHttpRequest Objekt erzeugen
	client       = new XMLHttpRequest();

	var prog = document.getElementById("progress");

	if(!file) return;

	// progress bar ...
	prog.value = 0;
	prog.max   = 100;

	//Fügt dem formData Objekt unser File Objekt hinzu
	formData.append("datei", file);

    client.onerror = function(e) {
        alert("onError");
	console.log("Upload ERROR: "+client.status);
    	};

    client.onload = function(e) {
        document.getElementById("prozent").innerHTML = "100%";
        prog.value = prog.max;
	//if (p == 100)  { alert("test1"); }
	console.log("Upload DONE: "+client.status);
	if (client.status != 200) { alert("Error: "+client.status); }
    	};

    client.upload.onprogress = function(e) {
        var p = Math.round(100 / e.total * e.loaded);
        document.getElementById("progress").value 	= p;
        document.getElementById("prozent").innerHTML 	= p + "%";

	//console.log("progress: "+p);
	if (p == 100)  {
		setTimeout(function(){ callback(param); },1000 );
		}

	console.log("Upload PROGRESS: "+client.status);
    	};

    client.onabort = function(e) {
        alert("Upload abgebrochen");
	console.log("Upload ABORT: "+client.status);
    	};

	client.open("POST", "upload.php");
	client.send(formData);

}


//-------------------------



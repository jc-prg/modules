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
function fileUpload(callback, param="")
    client.onerror = function(e)
    client.onload = function(e)
    client.upload.onprogress = function(e)
    client.onabort = function(e)
*/
//-------------------------------------------------------


function jcUpload (name, container) {

	this.appName		= name;
	this.appVersion	= "v0.3.0";
	this.appContainer	= container;
	
	this.uploadScript	= "modules/jc-upload/upload-0.3.0.php";
	this.uploadPath	= "upload-test";
	this.uploadType	= "";
	this.uploadFiles	= [];
	
	this.loaded		= false;
	this.httpClient	= undefined;
	this.callback		= undefined;
	
	console.log("Start " + this.appName + " (jcUpload " + this.appVersion + ")");

	this.language		= "DE";
	this.lang 		= {
		"DE" : {
			"MOVE-FILE-HERE" : "Datei hierher ziehen:",
			"SELECT-FILE"    : "Datei ausw&auml;hlen",
			"ONCE-A-TIME"    : "Upload nur Bild zur selben Zeit.",
			},
		"EN" : {
			"MOVE-FILE-HERE" : "Drag and drop file here:",
			"SELECT-FILE"    : "Select file",
			"ONCE-A-TIME"    : "Only one upload at the same time possible.",
			}
		}
	
	this.init		= function(uploadPath="", uploadType="", visibleValues=false, visibleButton=true) {
		this.visibleValues = visibleValues;
		this.visibleButton = visibleButton;
		if (uploadPath != "") { this.uploadPath = uploadPath; }
		if (uploadType != "") { this.uploadType = uploadType; }
		this.uploadForm();
		}

	
	this.uploadForm	= function() {

	      	if (this.visibleValues)	{ var visible = 'style="display:block;width:45%;float:left;margin:2px;"'; }
	        else				{ var visible = 'style="display:none"'; }
	        
	        if (this.visibleButton)	{ var visible2 = 'style="display:block;"'; }
	        else				{ var visible2 = 'style="display:none"'; }

		var default_form = ' \
			<div id="'+this.appName+'_uploadZone" class="droparea" ondrop="'+this.appName+'.fileDrop(event)" ondragover="'+this.appName+'.fileDropAllow(event)"> \
        			<small>'+this.lang[this.language]["MOVE-FILE-HERE"]+'</small> \
		        	<output id="'+this.appName+'_list"></output> \
			</div> \
			<div id="'+this.appName+'_uploadControl" class="upload"> \
        			<input type="file" id="'+this.appName+'_files" name="files[]" onChange="'+this.appName+'.fileSelect01(event);" /><br/> \
        			<input id="'+this.appName+'_uploadPath" value="' + this.uploadPath + '"  '+visible+'/> \
        			<input id="'+this.appName+'_uploadType" value="' + this.uploadType + '" '+visible+'/> \
        			<br/> \
				<hr style="background:gray;height:1px;border:0px;margin:5px;float:none;" /> \
				<div class="uploadCol"> \
					<button    id="'+this.appName+'_uploadbutton" onclick="'+this.appName+'.fileUpload();" '+visible2+'>upload</button><br/> \
			                <progress id="'+this.appName+'_progress" class="progressbar"></progress> <span id="'+this.appName+'_prozent"></span> \
				</div> \
				<div class="uploadCol"> \
					<div   id="'+this.appName+'_fileName">'+this.lang[this.language]["SELECT-FILE"]+'...</div> \
					<div   id="'+this.appName+'_fileSize"></div> \
					<div   id="'+this.appName+'_fileType"></div> \
					<input id="'+this.appName+'_fName" style="display:none;" /> \
				</div> \
			</div> \
			';
		
		if (this.appContainer != "")	{ document.getElementById(this.appContainer).innerHTML = default_form; }
		else				{ return default_form; }
		}


	this.uploadReset	= function() {
		this.uploadFiles	= [];
		this.loaded		= false;
		this.httpClient	= undefined;
		}

	
	this.fileDrag		= function(event) { event.dataTransfer.setData("text", ev.target.id); }
	this.fileDropAllow	= function(event) { event.preventDefault(); }
	this.fileDrop		= function(event) {
		event.preventDefault();
		var files =  event.dataTransfer.files;
		this.uploadFiles = [files[0]];
		this.fileSelect02();
		if (this.uploadFiles[1]) { alert(this.lang[this.language]["ONCE-A-TIME"]); }
		}

	
	this.fileSelect01	= function(e) {
		this.uploadFiles = e.target.files; // FileList object
		this.fileSelect02();
		}


	this.fileSelect02	= function() {
		// empty list
		document.getElementById(this.appName+'_list').innerHTML = "";
		// get files from list
		for (var i = 0, f; f = this.uploadFiles[i]; i++) {
			this.loaded = true;
			uploadAppName = this.appName;
			
			// continue only for image files
			if (!f.type.match('image.*')) { continue; }
			
			var reader = new FileReader();
			reader.onload = (function (theFile) {
				return function (e) {
					// create thumbnails.
					var vorschau		= document.createElement('img');
					vorschau.className	= 'vorschau';
					vorschau.src		= e.target.result;
					vorschau.title		= theFile.name;
					document.getElementById(uploadAppName+'_list').insertBefore(vorschau, null);
					document.getElementById(uploadAppName+'_fileName').innerHTML = "File: "+theFile.name;
					document.getElementById(uploadAppName+'_fName').value        = theFile.name;
					document.getElementById(uploadAppName+'_fileSize').innerHTML = "Size: "+theFile.size;
					document.getElementById(uploadAppName+'_fileType').innerHTML = "Type: "+theFile.type;
					};
				})(f);

			// get image from url
			reader.readAsDataURL(f);
			}
		}


	this.fileUpload	= function(param) {
		console.log("Start file upload ...");

		if (typeof this.uploadFiles !== 'undefined' && this.uploadFiles[0]) {
			var file     = this.uploadFiles[0]; // document.getElementById("fileA").files[0];
			console.log("1:"+file["name"]);
			}
		else {
			console.log("Error: Upload files not defined. ("+param+")");
			if (this.callback) { this.callback(param); }
			return;
			}

		if (!file)  { return; }
		this.httpClient	= new XMLHttpRequest();
		var progress	= document.getElementById(this.appName+"_progress");

		// progress bar ...
		progress.value	= 0;
		progress.max	= 100;
		uploadAppName	= this.appName;

		//FormData Objekt erzeugen
		var formData = new FormData();
		formData.append("datei", file);
		formData.append("upload_dir",  document.getElementById(this.appName+"_uploadPath").value);
		formData.append("upload_type", document.getElementById(this.appName+"_uploadType").value);

		this.httpClient.onerror = function(e) {
			alert("Upload ERROR: "+this.httpClient.status);
			console.log("Upload ERROR: "+this.httpClient.status);
			}.bind(this);

		this.httpClient.onload = function(e) {
			document.getElementById(uploadAppName+"_prozent").innerHTML = "100%";
			progress.value = progress.max;
			console.log("Upload DONE: "+this.httpClient.status);
			console.debug("---- Upload response ----");
			console.debug(this.httpClient.responseText);
			console.debug("----");
			if (this.httpClient.status != 200) { alert("Error: "+this.httpClient.status); }
			}.bind(this);

		this.httpClient.upload.onprogress = function(e) {
			var p = Math.round(100 / e.total * e.loaded);
			document.getElementById(uploadAppName+"_progress").value 	= p;
			document.getElementById(uploadAppName+"_prozent").innerHTML 	= p + "%";

			if (this.callback && p == 100)  {
				setTimeout(function(){ this.callback(param); }.bind(this),1000 );
				}

			console.log("Upload PROGRESS: "+this.httpClient.status);
			}.bind(this);

		this.httpClient.onabort = function(e) {
			alert("Upload aborted."+this.httpClient.status);
			console.log("Upload ABORT: "+this.httpClient.status);
			}.bind(this);

		console.log("Call Upload script: "+this.uploadScript);
		this.httpClient.open("POST", this.uploadScript);
		this.httpClient.send(formData);
		}

	}

//-------------------------
// EOF


<?php

function join_paths() {
    $paths = array();

    foreach (func_get_args() as $arg) {
        if ($arg !== '') { $paths[] = $arg; }
    }

    return preg_replace('#/+#','/',join('/', $paths));
}

// check if uploadDir is set
echo "Input vars:";
print_r($_POST);

if (isset($_POST['upload_dir'])) { $upload_dir  = $_POST['upload_dir']; }  else  { $upload_dir  = "../mbox_img/cover_upload"; }

$myinfofile  = join_paths($upload_dir,"/_upload_info.txt");
$mytestfile  = join_paths($upload_dir,"/_upload_test.txt");
$current_dir = getcwd();
$test        = true;

$abs_upload  = join_paths($current_dir,$upload_dir);

// check and show, if file and metadata is given
if (isset($_FILES['datei']['name'])) {
	$filename   = $_FILES['datei']['name'];
	echo "Filename: $filename\n";
	echo "Testfile: $mytestfile\n";
	echo "Upload Dir: $upload_dir\n";
	echo "Current Dir: $current_dir\n";
	echo "Abs. Upload dir: $abs_upload\n";
	}
else {
	echo "Filname: &lt;No filename set&gt;\n";
	echo "Testfile: $mytestfile\n";
	echo "Upload dir: $upload_dir\n";
	echo "Current Dir: $current_dir\n";
	}

// test if writing file works ... ?
if ($test) {
	$myfile = fopen($mytestfile, "w");
	fwrite($myfile, "TEST");
	fclose($myfile);
	echo "TEST WRITING ... to: $mytestfile\n";
	$myfile    = fopen($mytestfile, "r");
	if ($myfile) {
		while(!feof($myfile)) { $mycontent = fgets($myfile); }
		echo "TEST READING ... $mycontent\n";
  		}
  	else {
		echo "TEST READING ... ERROR (dir $upload_dir have to be writeable -> try chown or chmod 777 for the directory)\n";
		}
	fclose($myfile);
	}
	
// open testfile to write upload information
try {
	$myfile     = fopen($myinfofile, "w"); 
	if ( !$myfile ) { throw new Exception('File open failed.'); }
	fwrite($myfile, "test\n");
	}
catch ( Exception $e ) {
  	echo "ERROR: $e";
	} 

// upload and process file
if (isset($_FILES['datei'])) {

	foreach ($_FILES["datei"]["error"] as $key => $error) { fwrite($myfile, " --" . $key . "/" . $error . "--\n"); }
        $filename = join_paths($upload_dir,"/".basename($_FILES['datei']['name']));
        
	fwrite($myfile, "Filename: ".$filname."\n");
	$upload = move_uploaded_file($_FILES['datei']['tmp_name'], $filename);

	if ($upload) { fwrite($myfile, " - Upload erfolgt: " .     $filename); }
	else         { fwrite($myfile, " - Fehler bei Upload: " .  $filename); }

     //move_uploaded_file($_FILES['datei']['tmp_name'], basename($_FILES['datei']['name']));
     //move_uploaded_file($_FILES['datei']['tmp_name'], '/var/www/html/app/cover_upload/'.basename($_FILES['datei']['name']));

	}
else {
	fwrite(myfile, "Keine Datei ...");
	}
	
fclose($myfile);

?>

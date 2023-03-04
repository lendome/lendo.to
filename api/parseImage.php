<?php //The name of this file in this example is imgdata.php

  $url=$_GET['url'];
  header('Access-Control-Allow-Origin: *');
  // prevent hackers from uploading PHP scripts and pwning your system
  if(!@is_array(getimagesize($url))){
    echo "path/to/placeholderImage.png";
    exit("wrong file type.");
  }

  $img = file_get_contents($url);

  $fn = substr(strrchr($url, "/"), 1);
  file_put_contents($fn,$img);
  echo $fn;

?>
<?php

// <>
error_reporting(E_ALL);
error_reporting(-1);
ini_set('error_reporting', E_ALL);
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, username");
require('db.php');
$allInfo = array();

function crypto_rand_secure($min, $max)
{
  $range = $max - $min;
  if ($range < 1)
    return $min; // not so random...
  $log = ceil(log($range, 2));
  $bytes = (int) ($log / 8) + 1; // length in bytes
  $bits = (int) $log + 1; // length in bits
  $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
  do {
    $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
    $rnd = $rnd& $filter; // discard irrelevant bits
  } while ($rnd > $range);
  return $min + $rnd;
}

function getToken($length)
{
  $token = "";
  $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  $codeAlphabet .= "abcdefghijklmnopqrstuvwxyz";
  $codeAlphabet .= "0123456789";
  $max = strlen($codeAlphabet); // edited

  for ($i = 0; $i < $length; $i++) {
    $token .= $codeAlphabet[crypto_rand_secure(0, $max - 1)];
  }

  return $token;
}




if (isset($_GET["token"])) {
  $token = $_GET["token"];
  $query = "SELECT * FROM users WHERE token=?";
  $stmt = $con->prepare($query);
  $stmt->bind_param("s", $token);
  $stmt->execute();
  $result = $stmt->get_result();
  if (mysqli_num_rows($result) < 1) {
    print_r(
      array(
        "text" => "user not found",
        "code" => 404
      )
    );
  }
  $usr = $result->fetch_assoc();
  print_r($usr);

} else if (isset($_GET["id"])) {
  $id = $_GET["id"];
  $stmt = $con->prepare("SELECT username,creation_date,id FROM users WHERE id=?");
  $stmt->bind_param("i", $id);
  $stmt->execute();
  $result = $stmt->get_result();
  if (mysqli_num_rows($result) > 0) {
    print_r($result->fetch_assoc());
  } else {
    print_r(
      array(
        "text" => "user not found",
        "code" => 404
      )
    );
  }
} else if (isset($_GET["login"])) {

  $headers = apache_request_headers();
  if (!isset($headers["username"])) {
    echo json_encode(
      array(
        "err" => "Please enter a username.",
      )
    );
    exit();
  }
  if (!isset($headers["password"])) {
    echo json_encode(
      array(
        "err" => "Please enter a password.",
      )
    );
    exit();
  }
  $query = "SELECT * FROM users WHERE password=? and username=?";
  $stmt = $con->prepare($query);
  $pw = hash('sha256', $headers["password"]);
  $uname = $headers["username"];
  $stmt->bind_param("ss", $pw, $uname);
  $stmt->execute();
  $result = $stmt->get_result();
  $token = $result->fetch_assoc();
  if (mysqli_num_rows($result) == 1) {
    echo json_encode(
      array(
        "token" => $token["token"],
        "code" => 200,
        
      )
    );
  } else {
    echo json_encode(
      array(
        "err" => "Incorrect username/password.",
      )
    );
    exit();
  }
} else if (isset($_GET["register"])) {
  $headers = apache_request_headers();
  if (!isset($headers["username"])) {
    print_r(
      array(
        "text" => "Please enter a username.",
        "code" => 404,

      )
    );
    exit();
  }
  if (!isset($headers["password"])) {
    print_r(
      array(
        "text" => "Please enter a password.",
        "code" => 404,
      )
    );
    exit();
  }
  $username = stripslashes($headers['username']);
  //escapes special characters in a string
  $username = mysqli_real_escape_string($con, $username);
  // $email = stripslashes($headers['email']);
  // $email = mysqli_real_escape_string($con, $email);
  $password = stripslashes($headers['password']);
  $password = mysqli_real_escape_string($con, $password);
  $query = "SELECT * FROM users WHERE username=?";
  $stmt = $con->prepare($query);
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();
  if (mysqli_num_rows($result) > 0) {
    print_r(
      array(
        "text" => "Username already in use.",
        "code" => 409,
      )
    );
    exit();
  }
  $token = getToken(90);
  $temp = getToken(90);
  $finalpw = hash('sha256', $password);
  $stmt = $con->prepare("INSERT INTO users (username,password, token) VALUES (?, ?, '$token')");
  $stmt->bind_param("ss", $username, $finalpw);



  if ($stmt->execute()) {
    print_r(
      array(
        "text" => "Account created successfully.",
        "code" => 200,
        "token" => $token,
      )
    );

    exit();
  } else {
    print_r(
      array(
        "text" => "Unknown error occured.",
        "code" => 400,
      )
    );
    exit();
  }

}
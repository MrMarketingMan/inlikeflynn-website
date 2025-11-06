<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $to = "inlikeflynn@inlikeflynnllc.com";
  $subject = "New Website Inquiry";
  $name = isset($_POST['name']) ? $_POST['name'] : '';
  $email = isset($_POST['email']) ? $_POST['email'] : '';
  $message = isset($_POST['message']) ? $_POST['message'] : '';
  $body = "Name: " . $name . "\nEmail: " . $email . "\n\nMessage:\n" . $message;
  $headers = "From: noreply@inlikeflynnllc.com\r\nReply-To: " . $email;

  if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
  } else {
    http_response_code(500);
  }
}
?>
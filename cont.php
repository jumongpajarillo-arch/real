<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $subject = htmlspecialchars($_POST["subject"]);
    $message = htmlspecialchars($_POST["message"]);

    // Example: save to file or send email
    file_put_contents("messages.txt", "$name | $email | $subject | $message\n", FILE_APPEND);

    echo "✅ Message received successfully!";
} else {
    http_response_code(405);
    echo "Method not allowed";
}
?>

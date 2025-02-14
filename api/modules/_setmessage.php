<?php

function setMessage($type, $text, $body) {
    $message = new stdClass();
    $message->type = $type;
    $message->message = $text;
    if ($body) {
        $message->body = $body;
    }
    echo json_encode($message, JSON_PRETTY_PRINT);
}

?>
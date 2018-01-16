<?php

// session_start();

include_once "config.php";

function generator($size = 32) {
$alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
$code     = '';

for ($i = 0; $i < $size; $i++) {
    $num  = rand(0, strlen($alphabet) - 1);
    $code.= $alphabet[$num];
}

return $code;
}

function checkUser() {
$session = isset($_COOKIE['PHPSESSID']) ? $_COOKIE['PHPSESSID'] : '';
$token   = isset($_COOKIE['token']) ? $_COOKIE['token'] : '';

//Если нет токена возыращаем фолс
if(!$token) {
    return false;
}

else {
        $db  = mysqli_connect(HOST, USER, PASS, BASE);

        if (mysqli_connect_errno()) {
            return false;
        }
        else {
            mysqli_set_charset($db, 'UTF8');
            $query = mysqli_query($db, '
            SELECT
            user.user_id             AS id,
            user_email               AS email,
            IF(NOW() > expire, 1, 0) AS rebuild
            FROM user
            LEFT JOIN connect USING(user_id)
            WHERE session = "' . mysqli_real_escape_string($db, $session) . '"
            AND   token   = "' . mysqli_real_escape_string($db, $token)   . '";
            ');
            $user = mysqli_fetch_assoc($query);

            if ($user AND $user['rebuild'] == 0) {
                $expire  = time() + 300;
                $session = $_COOKIE['PHPSESSID'];
                $token   = generator();
                mysqli_query($db, '
                UPDATE connect SET
                token   = "' . $token . '",
                expire  = "FROM_UNIXTIME(' . $expire . ')"
                WHERE session = "' . $session . '";
                ');
                setcookie('_ab', $token, time() + 60 * 60 * 24, '/');
            }

            return true;
        }
}

}


// Получаем ID авторизованного пользователя
function getUserId($token, $session) {
    $db  = mysqli_connect(HOST, USER, PASS, BASE);

    if (mysqli_connect_errno()) {
        return false;
    }

    else {
        mysqli_set_charset($db, 'UTF8');
        $query = mysqli_query($db, '
            SELECT user_id FROM connect
            WHERE session = "' . $session . '"
            AND token = "' . $token .'";
        ');

        $user_id = mysqli_fetch_assoc($query);

        return (int)$user_id['user_id'];
    }
}

?>

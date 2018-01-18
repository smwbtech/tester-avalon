<?php

    session_start();

    include_once "config.php";
    include_once "functions.php";

    // axios отправляет данные в виде json файла, принимаем его из потока и сохраняем, как глобальны массив $_POST
    $_POST = json_decode(file_get_contents('php://input'), true);

    if(isset($_POST["userEmail"]) && isset($_POST["userPassword"])) {

        $userEmail = htmlspecialchars($_POST["userEmail"]);
        $userPassword = htmlspecialchars($_POST["userPassword"]);
        $res = array("success" => true, "errorMsg" => "", "errorText" => "");

        $db  = mysqli_connect(HOST, USER, PASS, BASE);
            // В случае ошибки соединеия с БД отправляем JSON с текстом ошибки
            // TODO: mysqli_real_escape_string
            if (mysqli_connect_errno()) {
                    $res["success"] = false;
                    $res["errorMsg"] = "Ошибка соединения с базой данных, попробуйте зарегистрироваться позже";
                    $res["errorText"] = mysqli_connect_error();
                    echo json_encode($res);
                    exit();
            }
            else {
                mysqli_set_charset($db, 'UTF8');

                $check = mysqli_query($db, '
                    SELECT * FROM user
                    WHERE user_email = "' .  $userEmail .'";
                ');

                $user = mysqli_fetch_assoc($check);

                //Проверяем совпадения пароля с хэшем
                if(password_verify($userPassword, $user['user_password'])) {

                    $id      = $user['user_id'];
                    $expire  = time() + 100 * 60 * 60 * 24;
                    $session = isset($_COOKIE['PHPSESSID']) ? $_COOKIE['PHPSESSID'] : session_id();
                    $token   = generator();

                    mysqli_query($db, '
                        INSERT INTO connect SET
                        session = "' . $session . '",
                        token   = "' . $token   . '",
                        user_id = "' . $id      . '",
                        expire  = "FROM_UNIXTIME(' . $expire . ')";
                    ');

                    setcookie('token', $token, time() + 60 * 60 * 24, '/');

                    echo json_encode($res);
                    exit();
                }
                else {
                    $res["success"] = false;
                    $res["errorMsg"] = "Неправильное сочетнае Email и пароля, попробуйте еще раз";
                    echo json_encode($res);
                    exit();
                }
            }

    }
    else {
    }

 ?>

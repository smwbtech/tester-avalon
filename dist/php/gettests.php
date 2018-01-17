<?php

    session_start();

    include_once "config.php";
    include_once "functions.php";

    if(checkUser()) {
        $user_id = getUserId($_COOKIE["token"], $_COOKIE["PHPSESSID"]);

        $res = array("success" => true, "errorMsg" => "", "errorText" => "", "tests" => []);
        $db  = mysqli_connect(HOST, USER, PASS, BASE);

        if (mysqli_connect_errno()) {
                $res["success"] = false;
                $res["errorMsg"] = "Ошибка соединения с базой данных, попробуйте зарегистрироваться позже";
                $res["errorText"] = mysqli_connect_error();
                echo json_encode($res);
                exit();
        }

        else {

            mysqli_set_charset($db, 'UTF8');
            //Проверяем, существует ли уже такой тест (подобным считаем тест с таким же названием, описанием и авторством тогоже пользователя)
            $tests = mysqli_query($db, '
                SELECT * FROM test
                WHERE test_author_id = "' . $user_id . '";
            ');

            $res['tests'] = mysqli_fetch_all($tests, MYSQLI_ASSOC);
            echo json_encode($res);

        }
    }

 ?>

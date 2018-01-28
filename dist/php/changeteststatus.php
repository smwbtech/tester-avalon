<?php

    session_start();

    include_once "config.php";
    include_once "functions.php";

    if(checkUser()) {
        $user_id = getUserId($_COOKIE["token"], $_COOKIE["PHPSESSID"]);
        $test_id = (int)$_GET['test_id'];
        $res = array("success" => true, "errorMsg" => "", "errorText" => "");

        $db  = mysqli_connect(HOST, USER, PASS, BASE);
        mysqli_set_charset($db, 'UTF8');

        if (mysqli_connect_errno()) {
                $res["success"] = false;
                $res["errorMsg"] = "Ошибка соединения с базой данных, попробуйте зарегистрироваться позже";
                $res["errorText"] = mysqli_connect_error();
                echo json_encode($res);
                exit();
        }

        else {
            $upd = mysqli_query($db, '
            UPDATE test
            SET test_status = 1
            WHERE test_id = "'.$test_id.'"
            AND test_author_id = "'.$user_id.'";
            ');

            if(mysqli_affected_rows($db) > 0) {
                echo json_encode($res);
            }

            else {
                $res['success'] = false;
                $res['errorMsg'] = 'Операция обновления отклонена!';
                echo json_encode($res);
            }
        }




    }

?>

<?php

    session_start();

    include_once "config.php";
    include_once "functions.php";

    // axios отправляет данные в виде json файла, принимаем его из потока и сохраняем, как глобальны массив $_POST
    $_POST = json_decode(file_get_contents('php://input'), true);

    $user_id = getUserId($_COOKIE["token"], $_COOKIE["PHPSESSID"]);

    if(isset($_POST['test_db_id']) && isset($_POST['anonym']) && isset($_POST['token']) && isset($_POST['answers'])) {

        $anonym = (int)$_POST['anonym'];
        $user_id = $anonym == 1 ? getUserId($_COOKIE["token"], $_COOKIE["PHPSESSID"]) : 0;
        $test_id = $_POST['test_db_id'];
        $answers = $_POST['answers'];
        $token = htmlspecialchars($_POST['token']);

        $res = array("success" => true, "errorMsg" => "", "errorText" => "", "result" => []);
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
            //Сохраняем попытку пользователя в базе данных
            $test_answer_insert = mysqli_query($db, '
            INSERT INTO test_answers SET
            test_answer_test_id = "' . $test_id . '",
            test_answer_user_id = "' . $user_id . '",
            test_answer_token = "' . $token . '",
            test_answer_time_end = "' . time() . '";
            ');

            if(mysqli_affected_rows($db) == 1) {

                $test_answer_id = mysqli_insert_id($db);
                //Сохраняем ответы пользователя по данной попытке
                foreach ($answers as $key => $answer) {
                    mysqli_query($db, '
                    INSERT INTO user_answers SET
                    user_answers_test_answers_id = "' . $test_answer_id . '",
                    user_answers_answer = "' . mysqli_real_escape_string($db, $answer['answer']) . '",
                    user_answers_question_id = "' . $answer['questionDbId'] . '";
                    ');
                }

                $res['result'] = checkTest($test_answer_id);
                echo json_encode($res);
                exit();

            }
            else {

                $res["success"] = false;
                $res["errorMsg"] = "Ошибка сохранения результата, попробуйте зарегистрироваться позже";
                $res["errorText"] = mysqli_connect_error();
                echo json_encode($res);
                exit();

            }


        }


    }

    echo json_encode($_POST);

?>

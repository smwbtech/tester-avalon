<?php

    session_start();

    include_once "config.php";
    include_once "functions.php";

    if(checkUser()) {

        $user_id = getUserId($_COOKIE["token"], $_COOKIE["PHPSESSID"]);
        $test_id = (int)$_GET['test_id'];

        $res = array("success" => true, "errorMsg" => "", "errorText" => "", "test" => []);
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
            $test = mysqli_query($db, '
            SELECT * FROM test
            WHERE test_id = '. $test_id .';
            ');


            $res['test'] = mysqli_fetch_assoc($test);

            $questions = mysqli_query($db, '
            SELECT question.*, question_answer_answer AS question_answer
            FROM question
            LEFT JOIN question_answer ON question_id = question_answe_question_id
            WHERE question_test_id = '. $test_id .';
            ');

            $res['test']['questions'] = mysqli_fetch_all($questions, MYSQLI_ASSOC);

            foreach ($res['test']['questions'] as $key => $question) {
                $question_id = $question['question_id'];

                $vars = mysqli_query($db, '
                SELECT question_variant_id AS var_bd_id, question_variant_text AS var_text, question_variant_client_id AS question_client_id
                FROM question_variant
                WHERE question_variant_question_id = '. $question_id .';
                ');

                $res['test']['questions'][$key]['vars'] = mysqli_fetch_all($vars, MYSQLI_ASSOC);

            }

            echo json_encode($res);



        }
    }

?>

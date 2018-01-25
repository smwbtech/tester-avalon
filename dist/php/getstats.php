<?php

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
        //Выбираем все тесты пользователя
        $tests = mysqli_query($db, '
            SELECT test_id, test_name
            FROM test
            WHERE test_author_id = "'.$user_id.'";
        ');


        $res['tests'] = mysqli_fetch_all($tests, MYSQLI_ASSOC);

        //Обходим их в цикле и для каждого теста добавляем варианты ответа

        foreach ($res['tests'] as $key => $test) {
            $test_id = $test['test_id'];

            $tries = mysqli_query($db, '
            SELECT test_answers.*, user.user_email
            FROM test_answers
            LEFT JOIN user ON user_id = test_answers.test_answer_user_id
            WHERE test_answers.test_answer_test_id = "'.$test_id.'";
            ');

            $res['tests'][$key]['tries'] = mysqli_fetch_all($tries, MYSQLI_ASSOC);

            foreach ($res['tests'][$key]['tries'] as $k => $answer) {
                $res['tests'][$key]['tries'][$k]['result'] = checkTest($answer['test_answer_id']);
            }
        }


        echo json_encode($res);

    }
}



 ?>

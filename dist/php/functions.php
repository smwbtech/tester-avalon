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

// Проверяем результаты теста и получани статистику
function checkTest($test_answer_id) {

    $db  = mysqli_connect(HOST, USER, PASS, BASE);

    if (mysqli_connect_errno()) {
        return false;
    }
    else {

        $res = array(
            'test_answers_id' => $test_answer_id,
            'time_start' => 0,
            'time_end' => 0,
            'user_id' => 0,
            'answers' => []
        );

        mysqli_set_charset($db, 'UTF8');
        $query = mysqli_query($db, '
        SELECT user_answers.user_answers_answer AS user_answer,
        question_answer.question_answer_answer AS question_answer,
        question.question_type_id AS question_type,
        question.question_id AS question_id,
        question.question_id AS question_id
        FROM user_answers
        JOIN question_answer
        ON user_answers.user_answers_question_id = question_answer.question_answe_question_id
        JOIN question ON question.question_id = user_answers.user_answers_question_id
        WHERE user_answers.user_answers_test_answers_id = "'.$test_answer_id.'";
        ');

        $answers = mysqli_fetch_all($query, MYSQLI_ASSOC);



        foreach ($answers as $key => $answer) {
            $result = array(
                "question_id" => $answer['question_id'],
                "result" => false
            );
            switch (+$answer['question_type']) {
                case 1:
                    $result['result'] = $answer['user_answer'] == $answer['question_answer'];
                    break;
                case 2:
                    $arr = explode(",",$answer['user_answer']);
                    $arr2 = explode(",", $answer['question_answer']);
                    sort($arr);
                    sort($arr2);
                    $result['result'] = implode($arr) == implode($arr2);
                    break;
                case 3:
                    $user_answer = $answer['user_answer'];
                    $right_answer = $answer['question_answer'];
                    $pattern = "/$user_answer/i";
                    $result['result'] = (bool)preg_match($pattern, $right_answer);
                    break;
            }
            array_push($res['answers'], $result);
        }

    $stats = mysqli_query($db, '

        SELECT test_answer_time_start AS time_start,
        test_answer_time_end AS time_end,
        test_answer_user_id AS user_id
        FROM test_answers
        WHERE test_answer_id = "'.$test_answer_id.'";

    ');

    $stats = mysqli_fetch_assoc($stats);
    $res['time_start'] = $stats['time_start'];
    $res['time_end'] = $stats['time_end'];
    $res['user_id'] = $res['user_id'];

    return $res;

    }

}

?>

<?php

    session_start();

    include_once "config.php";
    include_once "functions.php";

    // axios отправляет данные в виде json файла, принимаем его из потока и сохраняем, как глобальны массив $_POST
    $_POST = json_decode(file_get_contents('php://input'), true);

    if(checkUser()) {
        $user_id = getUserId($_COOKIE["token"], $_COOKIE["PHPSESSID"]);

        //Если установленны обязательные поля теста
        if(isset($_POST['description']) && isset($_POST['questions']) && isset($_POST['title'])) {

            $title = htmlspecialchars($_POST['title']);
            $description = htmlspecialchars($_POST['description']);
            $questions = $_POST['questions'];
            $timelimit = $_POST['options']['timeLimit'] ? (int)$_POST['options']['time'] : 0;
            $anonym = $_POST['options']['anonym'] ? 1 : 0;
            $test_status = (int)$_POST['status'];
            $testId = isset($_POST['testId']) ? (int)$_POST['testId'] : false;

            $res = array("success" => true, "errorMsg" => "", "errorText" => "");
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
                //Если тест уже существует, удалим его и перезапишем все заново
                if($testId) {

                    mysqli_query($db, '
                        DELETE FROM test
                        WHERE test_id = "'.$testId.'"
                        AND test_author_id = "'.$user_id.'";
                    ');

                }


                $test_insert = mysqli_query($db, '
                    INSERT INTO test SET
                    test_name = "' . mysqli_real_escape_string($db,$title) . '",
                    test_description  = "' . mysqli_real_escape_string($db,$description)  . '",
                    test_author_id = "' . $user_id . '",
                    test_time = "' . (int)$timelimit . '",
                    test_anonym = "' . $anonym . '",
                    test_status = "' . $test_status . '";
               ');

               $test_id = mysqli_insert_id($db);


               // Сохраняем вопросы
               foreach ($questions as $key => $question) {
                   $qst_description = $question['text'];
                   $qst_client_id = (int)$question['id'];
                   $qst_type =  (int)$question['type'];
                   $qst_img = isset($question['img']) ? $question['img'] : '';

                   $question_insert = mysqli_query($db, '
                       INSERT INTO question SET
                       question_description = "' . mysqli_real_escape_string($db,$qst_description) . '",
                       question_type_id  = "' . $qst_type  . '",
                       question_picture = "' . $qst_img . '",
                       question_client_id = "' . $qst_client_id . '",
                       question_test_id = "'. $test_id . '";
                  ');

                  $question_id = mysqli_insert_id($db);
                  $answer = '';


                  // Если вопрос типа один из множества или несколько из множества
                  if($qst_type == 1 || $qst_type == 2) {
                      foreach ($question['vars'] as $key => $variant) {
                          $var_text = htmlspecialchars($variant['text']);
                          $var_client_id = (int)$variant['id'];
                          if((bool)$variant['isRight']) {
                              strlen($answer) == 0 ? $answer .= $var_client_id : $answer .= ",$var_client_id";
                          }



                          $var_insert = mysqli_query($db, '
                              INSERT INTO question_variant SET
                              question_variant_question_id = "' . $question_id . '",
                              question_variant_text  = "' . mysqli_real_escape_string($db,$var_text)  . '",
                              question_variant_client_id = "' . $var_client_id . '";
                         ');

                      }
                  }
                  // Если вариант ответа - строка
                  else if($qst_type == 3) {
                      $answer = $question['vars'];
                  }

                  $var_answer = mysqli_query($db, '
                      INSERT INTO question_answer SET
                      question_answe_question_id = "' . $question_id . '",
                      question_answer_answer  = "' . $answer  . '";
                 ');
               }
            echo json_encode($res);
            exit();


            }

        }


    }
 ?>

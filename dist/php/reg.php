<?php

    session_start();

    include_once "config.php";
    include_once "functions.php";

    // axios отправляет данные в виде json файла, принимаем его из потока и сохраняем, как глобальны массив $_POST
    $_POST = json_decode(file_get_contents('php://input'), true);

    // Проверяем, заполнены ли обязательные поля
    if(isset($_POST["userEmail"]) && isset($_POST["userPassword"]) && isset($_POST["userPassword_re"])) {

        $userEmail = htmlspecialchars($_POST["userEmail"]);
        $userPassword = htmlspecialchars($_POST["userPassword"]);
        $userPassword_re = htmlspecialchars($_POST["userPassword_re"]);
        $userName = isset($_POST["userName"]) ? htmlspecialchars($_POST["userName"]) : "";
        $userLastName = isset($_POST["userLastName"]) ?  htmlspecialchars($_POST["userLastName"]) : "";
        $userCompany = isset($_POST["userCompany"]) ?  htmlspecialchars($_POST["userCompany"]) : "";

        //Проверка Email
        if(userEmailCheck($userEmail)) {
            $res = array("success" => true, "errorMsg" => "", "errorText" => "");
            $db  = mysqli_connect(HOST, USER, PASS, BASE);
                // В случае ошибки соединеия с БД отправляем JSON с текстом ошибки
	            if (mysqli_connect_errno()) {
                        $res["success"] = false;
                        $res["errorMsg"] = "Ошибка соединения с базой данных, попробуйте зарегистрироваться позже";
        	            $res["errorText"] = mysqli_connect_error();
                        echo json_encode($res);
                        exit();
                }
                else {
                    mysqli_set_charset($db, 'UTF8');


                    // Проверяем, есть ли пользователь с таким Email в базе данных
                    $check = mysqli_query($db, '
                        SELECT * FROM user
                        WHERE user_email = "' . $userEmail . '";
                    ');

                    // Если есть то вернем ошибку
                    if(mysqli_num_rows($check)) {
                        $res["success"] = false;
                        $res["errorMsg"] = "Пользователь с таким email уже существует, введите другой email";
                        echo json_encode($res);
                        exit();
                    }

                    else {

                        // Проверяем пароль
                        if(userPasswordCheck($userPassword)) {
                            $userPassword = password_hash($userPassword, PASSWORD_BCRYPT);
                            $userEmail = mysqli_real_escape_string($db, htmlspecialchars($userEmail));

                            mysqli_query($db, '
		                        INSERT INTO user SET
    							user_email = "' . $userEmail . '",
    							user_password  = "' . $userPassword  . '",
                                user_name = "' . $userName . '",
                                user_lastname = "' . $userLastName . '",
                                user_company = "' . $userCompany . '";
	                       ');

                            $id      = mysqli_insert_id($db);
                            $expire  = time() + 1000 * 60 * 60 * 24;
                            $session = $_COOKIE['PHPSESSID'];
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

                        }

                    }

                }

        }

    }

    else {

    }

    //Helpers

    function userEmailCheck($userEmail) {
        $pattern = '/^(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){255,})(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){65,}@)(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22))(?:\\.(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-+[a-z0-9]+)*\\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-+[a-z0-9]+)*)|(?:\\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\\]))$/iD';
        return (preg_match($pattern, $userEmail) === 1);
    }

    function userPasswordCheck($userPassword) {
        $pattern = '/[a-z0-9!@#$%^&*]{6,}/i';
        return (preg_match($pattern, $userPassword) === 1);
    }

?>

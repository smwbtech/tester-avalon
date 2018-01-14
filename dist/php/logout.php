<?php
	session_start();
	include_once 'config.php';
	include_once 'function.php';

	$session = isset($_COOKIE['PHPSESSID']) ? $_COOKIE['PHPSESSID'] : '';
	$token   = isset($_COOKIE['token']) ? $_COOKIE['token'] : '';

	$db  = mysqli_connect(HOST, USER, PASS, BASE);

	if (mysqli_connect_errno()) {
		return false;
	}
	else {
		mysqli_query($db, '
			DELETE FROM connect
			WHERE session = "' . $session . '"
			AND   token   = "' . $token   . '"
			LIMIT 1;
		');

		setcookie('PHPSESSID', '', time(), '/');
		setcookie('token', '', time(), '/');
        unset($_COOKIE['token']);
        // setcookie('token', '', time() - 10000000000000000000000, '/');
	}


?>

-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Янв 27 2018 г., 10:33
-- Версия сервера: 10.1.30-MariaDB
-- Версия PHP: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `tester`
--

-- --------------------------------------------------------

--
-- Структура таблицы `connect`
--

CREATE TABLE `connect` (
  `session` varchar(100) NOT NULL,
  `token` char(32) DEFAULT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `expire` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `connect`
--

INSERT INTO `connect` (`session`, `token`, `user_id`, `expire`) VALUES
('p0qnpn1vusllmfjj4b6pg8m8vc', '5gmvanw2ecb0qbxzbwb384k2jmgv5m0v', 0, '0000-00-00 00:00:00'),
('p0qnpn1vusllmfjj4b6pg8m8vc', '2yca3in7ycttfxm81pejoea2rqg171z1', 0, '0000-00-00 00:00:00'),
('p0qnpn1vusllmfjj4b6pg8m8vc', '1fj8241b15jxno2382ywusv0kpereo5y', 0, '0000-00-00 00:00:00'),
('p0qnpn1vusllmfjj4b6pg8m8vc', 'afj0xiksxfu6ajq8ewgucxzwqbqghee5', 0, '0000-00-00 00:00:00'),
('p0qnpn1vusllmfjj4b6pg8m8vc', 'i6seb3kd9s7qa8g027mwdbzu3eworc9r', 0, '0000-00-00 00:00:00'),
('p0qnpn1vusllmfjj4b6pg8m8vc', 'yyaml5ewjxn7b1dli6wudtlv8beul4zk', 0, '0000-00-00 00:00:00'),
('p0qnpn1vusllmfjj4b6pg8m8vc', '0cyfsvfow4i4r2o38vbwpffi78juemc7', 9, '0000-00-00 00:00:00'),
('o61us57tmqetvv28d68p62v3q5', 'dzluj7rt3yo242kltmo0lkh6p1t7sl0b', 9, '0000-00-00 00:00:00'),
('vcs3ehoef5nfijsc2roddvmde2', 'ewti8nem2d8ond145lhr9022hdnw89fz', 9, '0000-00-00 00:00:00'),
('db322oa5hd9t195436t36sq85s', 'nfy0bzns8su6ygbb922s84khb9ru61x1', 9, '0000-00-00 00:00:00'),
('unkrf4e8uui7qutp0g9k6q7ldf', 'han158yf42czfywq1197ahacy1jipgde', 9, '0000-00-00 00:00:00'),
('lja0fbvc3vjs1s5cq6rb4vg59d', 'nc9fie5o1xlxc1i5simefx1wkxp37pgb', 9, '0000-00-00 00:00:00'),
('8676e4dc0jeal398pl2n43g3fl', 'gujcuvqr31wodnvo8bnfqsnsxolr592v', 9, '0000-00-00 00:00:00'),
('8676e4dc0jeal398pl2n43g3fl', 'ghilttpcsztjfvxjgh3sefss22o7l5q0', 9, '0000-00-00 00:00:00'),
('i1h8b5v4b2p8jti03pif9kr22u', 'wcwl5g8vm48mj4mb94x3u5os0ijj1wft', 9, '0000-00-00 00:00:00'),
('i1h8b5v4b2p8jti03pif9kr22u', 'tgnzva7nhnkrgfnj674i7x4ejl26724q', 9, '0000-00-00 00:00:00'),
('i1h8b5v4b2p8jti03pif9kr22u', 'fhldi444o45rc30bgm3gyv4xv2ed6926', 9, '0000-00-00 00:00:00'),
('1qbk23nr8fauk4nht00gst3lbq', 'br9yljra66fcbzmwma3ysmrpaeadzsww', 9, '0000-00-00 00:00:00'),
('2c6hvqgruttplmi9gguo5irqrr', 'w5ioiwvhxh71qmnlx5ce6f1bp9yuh619', 9, '0000-00-00 00:00:00'),
('f422a2d4rrhu0h724hciorq0b5', 'o36g5fwebj3h3hm2je1if4k99ufkcau6', 9, '0000-00-00 00:00:00'),
('i5aqdo85kut2gmj0vl49colihf', 'u5bod13yko0kan61x5jy9ecbn9hbjrcr', 9, '0000-00-00 00:00:00'),
('8elnh1r3jlafk3s083o8bpjtn7', '7n0m2paofpa774ibnp6vtc6wnfrsr0f8', 9, '0000-00-00 00:00:00'),
('', '4xyqdn9koy3kg4gf56ugallcauzj7a31', 0, '0000-00-00 00:00:00'),
('', 'ny1qkhosruvomeno6enu7o6gk71szpyk', 11, '0000-00-00 00:00:00'),
('ppp9nb44hq559fm1q3lvdvsiro', '6etbyyk9xr1ymexpx5evxg83ifly0526', 9, '0000-00-00 00:00:00'),
('av6vll7j79f81cihk4nccr7eel', 'o38c1mjkpqcz0uks9rkai41cbpmag6mz', 9, '0000-00-00 00:00:00'),
('181bc94ab941faa89b36e0a248d6799b', '5bxemt0f7zpws879ukb6f57umwnykrdb', 9, '0000-00-00 00:00:00'),
('49032091a6e2340e0b4239dd077dff44', 'sky1v2ho7e4cchf90i8ssyt105v4t34k', 9, '0000-00-00 00:00:00'),
('0d83f210207f9268d8e64d8d67c3fcb3', '1a5hacn4tg5w0jximgm25bkw4l4sbzx2', 9, '0000-00-00 00:00:00'),
('72d12824eac0f76dac39ec0bec8fe7e0', 'kgkn4to1ljay2nqx2pnx9yucdge37zp1', 9, '0000-00-00 00:00:00'),
('771a83a81aa851030dae88d0e9446481', '1zjhi61olz7goz4qvn4k86a4qhgztwrf', 9, '0000-00-00 00:00:00'),
('a9659092bf53ef892213e5b840ebc77c', '18t6rslvaq6d0lo5w941uyjj9a0b7lyj', 9, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `question`
--

CREATE TABLE `question` (
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `question_test_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `question_description` text,
  `question_type_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `question_picture` varchar(255) DEFAULT NULL,
  `question_client_id` tinyint(3) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `question`
--

INSERT INTO `question` (`question_id`, `question_test_id`, `question_description`, `question_type_id`, `question_picture`, `question_client_id`) VALUES
(57, 15, 'В каком году основан Петербург?', 1, '', 1),
(58, 15, 'Кто основал Санкт-Петербург?', 1, '', 2),
(59, 15, 'Главный проспект Санкт-Петербурга?', 3, '', 3),
(60, 15, 'Какие из этих достопримечательностей находится в Санкт-Петербурге?', 2, '', 4),
(61, 16, 'Для чего служит ключевое слово var', 1, '', 1),
(62, 16, 'Что из нижеперечисленного относится к структурам данных?', 2, '', 2),
(63, 16, 'Напиши, сколько будет 0 * -1', 3, '', 3),
(64, 16, 'Еще один вопрос', 1, '', 4),
(69, 18, 'Вопрос тестового теста 1', 1, '', 1),
(70, 18, 'Вопрос тестового теста 2', 2, '', 2),
(71, 18, 'Вопрос тестового теста 3', 3, '', 3),
(72, 18, 'Вопрос тестового теста 4', 1, '', 4),
(73, 19, 'Еще один тестовый тест 1', 1, '', 1),
(74, 19, 'Еще один тестовый тест 2', 1, '', 2),
(75, 19, 'Еще один тестовый тест 3', 1, '', 3),
(76, 19, 'Еще один тестовый тест 4', 1, '', 4),
(77, 20, 'Как переводится слово \'today\'?', 1, '', 1),
(78, 20, 'Форма прошедшего времени глагола go', 1, '', 2),
(79, 20, 'Переведите на английский: \"Сейчас полдень\"', 3, '', 3),
(80, 20, 'Какие артикли есть в английском языке?', 2, '', 4);

-- --------------------------------------------------------

--
-- Структура таблицы `question_answer`
--

CREATE TABLE `question_answer` (
  `question_answer_id` bigint(20) UNSIGNED NOT NULL,
  `question_answe_question_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_answer_answer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `question_answer`
--

INSERT INTO `question_answer` (`question_answer_id`, `question_answe_question_id`, `question_answer_answer`) VALUES
(57, 57, '4'),
(58, 58, '1'),
(59, 59, 'Невский проспект, невский'),
(60, 60, '1,2'),
(61, 61, '3'),
(62, 62, '1,2,3'),
(63, 63, '-0'),
(64, 64, '1'),
(69, 69, '3'),
(70, 70, '1,4'),
(71, 71, 'Строка'),
(72, 72, '1'),
(73, 73, '3'),
(74, 74, '1'),
(75, 75, '1'),
(76, 76, '1'),
(77, 77, '4'),
(78, 78, '1'),
(79, 79, 'It\'s noon'),
(80, 80, '1,3');

-- --------------------------------------------------------

--
-- Структура таблицы `question_comparison`
--

CREATE TABLE `question_comparison` (
  `question_comparison_id` bigint(20) UNSIGNED NOT NULL,
  `question_comparison_question_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_comparison_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `question_type`
--

CREATE TABLE `question_type` (
  `question_type_id` tinyint(3) UNSIGNED NOT NULL,
  `question_type_name` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `question_type`
--

INSERT INTO `question_type` (`question_type_id`, `question_type_name`) VALUES
(1, 'Один из множества'),
(2, 'Несколько из множества'),
(3, 'Строчка'),
(4, 'Последовательность'),
(5, 'Сравнение');

-- --------------------------------------------------------

--
-- Структура таблицы `question_variant`
--

CREATE TABLE `question_variant` (
  `question_variant_id` bigint(20) UNSIGNED NOT NULL,
  `question_variant_question_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_variant_text` text,
  `question_variant_client_id` tinyint(3) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `question_variant`
--

INSERT INTO `question_variant` (`question_variant_id`, `question_variant_question_id`, `question_variant_text`, `question_variant_client_id`) VALUES
(163, 57, '1704', 3),
(164, 57, '1703', 4),
(165, 57, '1791', 5),
(166, 57, '1700', 6),
(167, 58, 'Петр I', 1),
(168, 58, 'Екатерина II', 2),
(169, 58, 'Иван Грозный', 3),
(170, 58, 'Ленин', 4),
(171, 60, 'Синий мост', 1),
(172, 60, 'Летний сад', 2),
(173, 60, 'Парк Горького', 3),
(174, 60, 'Кремль', 4),
(175, 61, 'Объявление переменной', 3),
(176, 61, 'Вариант ответа', 4),
(177, 61, 'Объявление войны', 5),
(178, 62, 'Строка', 1),
(179, 62, 'Объект', 2),
(180, 62, 'Массив', 3),
(181, 62, 'Квартал', 4),
(182, 64, 'Right', 1),
(183, 64, 'Wrong', 2),
(193, 69, 'да', 3),
(194, 69, 'нет', 4),
(195, 70, 'да', 1),
(196, 70, 'нет', 2),
(197, 70, 'нет', 3),
(198, 70, 'да', 4),
(199, 72, 'да', 1),
(200, 72, 'нет', 2),
(201, 73, 'да', 3),
(202, 73, 'нет', 4),
(203, 74, 'да', 1),
(204, 74, 'нет', 2),
(205, 75, 'да', 1),
(206, 75, 'не', 2),
(207, 76, 'да', 1),
(208, 76, 'нет', 2),
(209, 77, 'вчера', 3),
(210, 77, 'сегодня', 4),
(211, 78, 'went', 1),
(212, 78, 'goed', 2),
(213, 80, 'the', 1),
(214, 80, 'das', 2),
(215, 80, 'a', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `statistic`
--

CREATE TABLE `statistic` (
  `statistic_id` bigint(20) UNSIGNED NOT NULL,
  `statistic_question_id` bigint(20) UNSIGNED DEFAULT NULL,
  `statictic_user_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `statistic_answer_status` bit(1) DEFAULT b'0',
  `statistic_answer_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `statistic_answer_user_answer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `test`
--

CREATE TABLE `test` (
  `test_id` mediumint(8) UNSIGNED NOT NULL,
  `test_name` varchar(150) DEFAULT NULL,
  `test_description` varchar(255) DEFAULT NULL,
  `test_author_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `test_time` smallint(5) UNSIGNED DEFAULT '0',
  `test_anonym` tinyint(1) DEFAULT '0',
  `test_status` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `test`
--

INSERT INTO `test` (`test_id`, `test_name`, `test_description`, `test_author_id`, `test_time`, `test_anonym`, `test_status`) VALUES
(15, 'Как хорошо ты знаешь Санкт-Петербург?', 'Как хорошо ты знаешь Санкт-Петербург?', 9, 0, 0, 1),
(16, 'Как хорошо ты знаешь JavaScript', 'Тест на знание JS', 9, 0, 0, 1),
(18, 'Еще один тестовый тест', 'Описание тестового теста', 9, 0, 0, 1),
(19, 'Еще один тестовый тест', 'Еще один тестовый тест', 9, 60, 1, 1),
(20, 'Основы английского', 'Это тест на базовые знания английского языка', 13, 0, 0, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `test_answers`
--

CREATE TABLE `test_answers` (
  `test_answer_id` mediumint(8) UNSIGNED NOT NULL,
  `test_answer_user_id` mediumint(8) UNSIGNED DEFAULT '0',
  `test_answer_token` varchar(100) DEFAULT NULL,
  `test_answer_test_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `test_answer_time_start` mediumint(8) UNSIGNED DEFAULT NULL,
  `test_answer_time_end` mediumint(8) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `test_answers`
--

INSERT INTO `test_answers` (`test_answer_id`, `test_answer_user_id`, `test_answer_token`, `test_answer_test_id`, `test_answer_time_start`, `test_answer_time_end`) VALUES
(2, 0, 'MTUxNjU1NDg1NjExNQ==', 20, NULL, 16777215),
(3, 0, 'MTUxNjU2NTgyNDA4MQ==', 16, NULL, 16777215),
(4, 0, 'MTUxNjU2NjA5NDIxNQ==', 16, NULL, 16777215),
(5, 0, 'MTUxNjU2NjQyMTU1MA==', 16, NULL, 16777215),
(6, 0, 'MTUxNjU2NjQ5MzgwOA==', 16, NULL, 16777215),
(7, 0, 'MTUxNjU2NzA4MjMyMQ==', 16, NULL, 16777215),
(8, 0, 'MTUxNjU2NzExMTUzMA==', 16, NULL, 16777215),
(9, 0, 'MTUxNjU2NzE2MjYxMw==', 16, NULL, 16777215),
(10, 0, 'MTUxNjU2NzIyMjUzNw==', 16, NULL, 16777215),
(11, 0, 'MTUxNjU2NzI2ODEwNg==', 16, NULL, 16777215),
(12, 0, 'MTUxNjU2NzMxMjM3OQ==', 16, NULL, 16777215),
(13, 0, 'MTUxNjU2NzM1Mjg0OQ==', 16, NULL, 16777215),
(14, 0, 'MTUxNjU2NzQxNDg3OQ==', 16, NULL, 16777215),
(15, 0, 'MTUxNjU2NzQ4MjYwNQ==', 16, NULL, 16777215),
(16, 0, 'MTUxNjU2NzUwNDMxOQ==', 16, NULL, 16777215),
(17, 0, 'MTUxNjU2NzUzNTc3OQ==', 16, NULL, 16777215),
(18, 0, 'MTUxNjU2ODExMzk3NQ==', 16, NULL, 16777215),
(19, 0, 'MTUxNjU2ODMzNDYzNg==', 16, NULL, 16777215),
(20, 0, 'MTUxNjU2ODM5MDE2Ng==', 16, NULL, 16777215),
(21, 0, 'MTUxNjU2ODUwNTE2Nw==', 16, NULL, 16777215),
(22, 0, 'MTUxNjU2ODY3MDM1OA==', 16, NULL, 16777215),
(23, 0, 'MTUxNjU2OTAwNTY3Mw==', 16, NULL, 16777215),
(24, 0, 'MTUxNjU2OTA2MDA5MA==', 16, NULL, 16777215),
(25, 0, 'MTUxNjU2OTM4MTE2NA==', 16, NULL, 16777215),
(26, 0, 'MTUxNjU2OTQzNDk2Mw==', 16, NULL, 16777215),
(27, 0, 'MTUxNjU2OTQ5NzMzNQ==', 16, NULL, 16777215),
(28, 0, 'MTUxNjU2OTU4NTcxMQ==', 16, NULL, 16777215),
(29, 0, 'MTUxNjU3MDAxMjY3MA==', 16, NULL, 16777215);

-- --------------------------------------------------------

--
-- Структура таблицы `user`
--

CREATE TABLE `user` (
  `user_id` mediumint(8) UNSIGNED NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_password` char(60) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `user_lastname` varchar(50) DEFAULT NULL,
  `user_company` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `user`
--

INSERT INTO `user` (`user_id`, `user_email`, `user_password`, `user_name`, `user_lastname`, `user_company`) VALUES
(9, 'roman.privalov@gmail.com', '$2y$10$d.J75P5xd53UIvLWzuJ3m.DTd5SQV99jT1SUaAr0n9tfhDNZFjkZO', 'Роман', 'Привалов', ''),
(10, 'olyared90@mail.ru', '$2y$10$C9DXZU3l1bNleLWwWNw6qukP3ABVXiuoB0uDX2r1dQuglxbhDJv0e', '', '', ''),
(12, 'test@text.com', '$2y$10$GEEqjo9WUGeuZMEzGFCTme59oIz66833biaPP5ZCCg5T6rggKZyoi', '', '', ''),
(13, 'V9110250351@yandex.ru', '$2y$10$uHpO2.3aCSNcbgS.cb2.VOnOMAev2UAjlN4nMZ5wUW8HJNrQTmnFO', '', '', '');

-- --------------------------------------------------------

--
-- Структура таблицы `user_answers`
--

CREATE TABLE `user_answers` (
  `user_answers_id` mediumint(8) UNSIGNED NOT NULL,
  `user_answers_test_answers_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `user_answers_question_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `user_answers_answer` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `user_answers`
--

INSERT INTO `user_answers` (`user_answers_id`, `user_answers_test_answers_id`, `user_answers_question_id`, `user_answers_answer`) VALUES
(6, 2, 77, '4'),
(7, 2, 78, '1'),
(8, 2, 79, 'it\'s noon'),
(9, 2, 80, '1,3'),
(10, 3, 61, '3'),
(11, 3, 62, '1,2,3'),
(12, 3, 63, '-0'),
(13, 3, 64, '1'),
(14, 4, 61, '3'),
(15, 4, 62, '1,2,3'),
(16, 4, 63, '-0'),
(17, 4, 64, '1'),
(18, 5, 61, '3'),
(19, 5, 62, '1,2,3'),
(20, 5, 63, '-0'),
(21, 5, 64, '1'),
(22, 6, 61, '3'),
(23, 6, 62, '2'),
(24, 6, 63, '-0'),
(25, 6, 64, '2'),
(26, 7, 61, '3'),
(27, 7, 62, '2'),
(28, 7, 63, '-0'),
(29, 7, 64, '1'),
(30, 8, 61, '3'),
(31, 8, 62, '2'),
(32, 8, 63, '-0'),
(33, 8, 64, '1'),
(34, 9, 61, '3'),
(35, 9, 62, '1,2,3'),
(36, 9, 63, '-0'),
(37, 9, 64, '1'),
(38, 10, 61, '3'),
(39, 10, 62, '1'),
(40, 10, 63, '-0'),
(41, 10, 64, '1'),
(42, 11, 61, '3'),
(43, 11, 62, '1,2,3'),
(44, 11, 63, '-0'),
(45, 11, 64, '1'),
(46, 12, 61, '3'),
(47, 12, 62, '1,2,3'),
(48, 12, 63, '-0'),
(49, 12, 64, '1'),
(50, 13, 61, '3'),
(51, 13, 62, '1,2,3'),
(52, 13, 63, '-0'),
(53, 13, 64, '1'),
(54, 14, 61, '3'),
(55, 14, 62, '1,2,3'),
(56, 14, 63, '-0'),
(57, 14, 64, '1'),
(58, 15, 61, '3'),
(59, 15, 62, '3,4'),
(60, 15, 63, '-0'),
(61, 15, 64, '1'),
(62, 16, 61, '3'),
(63, 16, 62, '1'),
(64, 16, 63, '-0'),
(65, 16, 64, '1'),
(66, 17, 61, '3'),
(67, 17, 62, '1,2,3'),
(68, 17, 63, '-0'),
(69, 17, 64, '1'),
(70, 18, 61, '3'),
(71, 18, 62, '1,2,3'),
(72, 18, 63, '-0'),
(73, 18, 64, '1'),
(74, 19, 61, '3'),
(75, 19, 62, '1'),
(76, 19, 63, '-0'),
(77, 19, 64, '1'),
(78, 20, 61, '3'),
(79, 20, 62, '1,3'),
(80, 20, 63, '-0'),
(81, 20, 64, '1'),
(82, 21, 61, '3'),
(83, 21, 62, '1,3'),
(84, 21, 63, '-0'),
(85, 21, 64, '1'),
(86, 22, 61, '3'),
(87, 22, 62, '1,2,3'),
(88, 22, 63, '-0'),
(89, 22, 64, '2'),
(90, 23, 61, '3'),
(91, 23, 62, '2'),
(92, 23, 63, '-0'),
(93, 23, 64, '1'),
(94, 24, 61, '5'),
(95, 24, 62, '1'),
(96, 24, 63, '-0'),
(97, 24, 64, '1'),
(98, 25, 61, '3'),
(99, 25, 62, '1'),
(100, 25, 63, '-0'),
(101, 25, 64, '1'),
(102, 26, 61, '3'),
(103, 26, 62, '1,3'),
(104, 26, 63, '-0'),
(105, 26, 64, '1'),
(106, 27, 61, '3'),
(107, 27, 62, '1'),
(108, 27, 63, '-0'),
(109, 27, 64, '1'),
(110, 28, 61, '3'),
(111, 28, 62, '1,2,3'),
(112, 28, 63, '-0'),
(113, 28, 64, '1'),
(114, 29, 61, '3'),
(115, 29, 62, '1,2,3'),
(116, 29, 63, '-0'),
(117, 29, 64, '1');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `question_test_id` (`question_test_id`);

--
-- Индексы таблицы `question_answer`
--
ALTER TABLE `question_answer`
  ADD PRIMARY KEY (`question_answer_id`),
  ADD KEY `question_answe_question_id` (`question_answe_question_id`);

--
-- Индексы таблицы `question_comparison`
--
ALTER TABLE `question_comparison`
  ADD PRIMARY KEY (`question_comparison_id`),
  ADD KEY `question_comparison_question_id` (`question_comparison_question_id`);

--
-- Индексы таблицы `question_type`
--
ALTER TABLE `question_type`
  ADD PRIMARY KEY (`question_type_id`);

--
-- Индексы таблицы `question_variant`
--
ALTER TABLE `question_variant`
  ADD PRIMARY KEY (`question_variant_id`),
  ADD KEY `question_variant_question_id` (`question_variant_question_id`);

--
-- Индексы таблицы `statistic`
--
ALTER TABLE `statistic`
  ADD PRIMARY KEY (`statistic_id`),
  ADD KEY `statistic_question_id` (`statistic_question_id`),
  ADD KEY `statictic_user_id` (`statictic_user_id`);

--
-- Индексы таблицы `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `test_author_id` (`test_author_id`);

--
-- Индексы таблицы `test_answers`
--
ALTER TABLE `test_answers`
  ADD PRIMARY KEY (`test_answer_id`),
  ADD UNIQUE KEY `test_answer_token` (`test_answer_token`),
  ADD KEY `test_answer_test_id` (`test_answer_test_id`);

--
-- Индексы таблицы `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Индексы таблицы `user_answers`
--
ALTER TABLE `user_answers`
  ADD PRIMARY KEY (`user_answers_id`),
  ADD KEY `user_answers_test_answers_id` (`user_answers_test_answers_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `question`
--
ALTER TABLE `question`
  MODIFY `question_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT для таблицы `question_answer`
--
ALTER TABLE `question_answer`
  MODIFY `question_answer_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT для таблицы `question_variant`
--
ALTER TABLE `question_variant`
  MODIFY `question_variant_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;

--
-- AUTO_INCREMENT для таблицы `test`
--
ALTER TABLE `test`
  MODIFY `test_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `test_answers`
--
ALTER TABLE `test_answers`
  MODIFY `test_answer_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT для таблицы `user`
--
ALTER TABLE `user`
  MODIFY `user_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `user_answers_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`question_test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_answer`
--
ALTER TABLE `question_answer`
  ADD CONSTRAINT `question_answer_ibfk_1` FOREIGN KEY (`question_answe_question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_variant`
--
ALTER TABLE `question_variant`
  ADD CONSTRAINT `question_variant_ibfk_1` FOREIGN KEY (`question_variant_question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `test_answers`
--
ALTER TABLE `test_answers`
  ADD CONSTRAINT `test_answers_test_id_ibfk_1` FOREIGN KEY (`test_answer_test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_answers`
--
ALTER TABLE `user_answers`
  ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`user_answers_test_answers_id`) REFERENCES `test_answers` (`test_answer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Янв 30 2018 г., 07:52
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
('e8bc5e236262e3b25e898daec8e1a52b', 'oyf51twny7fsyvq4qupk3kyq11shoi6f', 9, '0000-00-00 00:00:00'),
('5d5826f66812bc12f9e2411e728f8296', '6f34o41eankeeagl7rr3fjxv9ny6t6hj', 13, '0000-00-00 00:00:00'),
('349ef4cb7d6bb0b2942e62b2a02d52f8', 'xm7ex0od4od8s98g7pypaqy12cqb05k4', 9, '0000-00-00 00:00:00'),
('e2c42e2e9af0cb75e9fbec1e242fe893', 'sfrn8a66pjq3jkm0knvubu470kg181r0', 9, '0000-00-00 00:00:00'),
('74d81e784b1f824cfb2dafb6ae1c48de', 'x08dbrpukc0oerxs32m93faejr0a9rl9', 14, '0000-00-00 00:00:00'),
('56f8d2ca33b530e5330363a29fbe8eef', '3ht5a8g0j5dbtup4gkda0obwoh3kix1a', 9, '0000-00-00 00:00:00');

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
(77, 20, 'Как переводится слово \'today\'?', 1, '', 1),
(78, 20, 'Форма прошедшего времени глагола go', 1, '', 2),
(79, 20, 'Переведите на английский: \"Сейчас полдень\"', 3, '', 3),
(80, 20, 'Какие артикли есть в английском языке?', 2, '', 4),
(81, 21, 'Тест вопроса номер 1', 1, '', 1),
(82, 21, 'Тест вопроса номер 2', 2, '', 2),
(83, 21, 'Тест вопроса номер 3', 3, '', 3),
(84, 21, 'Тест вопроса номер 4', 1, '', 4),
(89, 23, 'Тест вопроса номер 1', 1, '', 1),
(90, 23, 'Тест вопроса номер 2', 2, '', 2),
(91, 23, 'Тест вопроса номер 3', 3, '', 3),
(92, 23, 'Тест вопроса номер 4', 1, '', 4),
(149, 38, 'Для чего служит используется слово var?\n', 1, '', 1),
(150, 38, 'Что из нижеперечисленного относится к структурам данных?\n', 2, '', 2),
(151, 38, 'Напишите результат следующего выражения 0 * -1\n', 3, '', 3),
(152, 38, 'Как расшифровывается аббревиатура JSON\n', 1, '', 4),
(153, 39, 'В каком году был основан Санкт-Петербург?', 1, '', 1),
(154, 39, 'Какие из нижеперечисленных рек протекают на территории Санкт-Петербурга?', 2, '', 2),
(155, 39, 'Напишите название главного проспекта Санкт-Петербурга:', 3, '', 3),
(156, 39, 'Кто является архитектором Зимнего Дворца?', 1, '', 4),
(157, 39, 'Самый широкий мост в Петербурге?', 1, '', 5),
(158, 39, 'Какие из нижеперечисленных достопримечательностей  находятся в Санкт-Петербурге?', 2, '', 6);

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
(77, 77, '4'),
(78, 78, '1'),
(79, 79, 'It\'s noon'),
(80, 80, '1,3'),
(81, 81, '3'),
(82, 82, '1,4'),
(83, 83, 'Строка'),
(84, 84, '1'),
(89, 89, '3'),
(90, 90, '1,4'),
(91, 91, 'Строка'),
(92, 92, '1'),
(149, 149, '3'),
(150, 150, '3,4'),
(151, 151, '-0'),
(152, 152, '3'),
(153, 153, '3'),
(154, 154, '1,2,4'),
(155, 155, 'Невский, невский проспект'),
(156, 156, '3'),
(157, 157, '2'),
(158, 158, '2,3,5');

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
(209, 77, 'вчера', 3),
(210, 77, 'сегодня', 4),
(211, 78, 'went', 1),
(212, 78, 'goed', 2),
(213, 80, 'the', 1),
(214, 80, 'das', 2),
(215, 80, 'a', 3),
(216, 81, 'Да', 3),
(217, 81, 'Нет', 4),
(218, 82, 'Да', 1),
(219, 82, 'Нет', 2),
(220, 82, 'Нет', 3),
(221, 82, 'Да', 4),
(222, 84, 'Да', 1),
(223, 84, 'Нет', 2),
(232, 89, 'Да', 3),
(233, 89, 'Нет', 4),
(234, 90, 'Да', 1),
(235, 90, 'Нет', 2),
(236, 90, 'Нет', 3),
(237, 90, 'Да', 4),
(238, 92, 'Да', 1),
(239, 92, 'Нет', 2),
(374, 149, 'Для объявления войны', 2),
(375, 149, 'Для объявления переменной', 3),
(376, 149, 'Я не знаю', 4),
(377, 150, 'Районы', 1),
(378, 150, 'Кварталы', 2),
(379, 150, 'Массивы', 3),
(380, 150, 'Объекты', 4),
(381, 152, 'John Snow kink Of North', 1),
(382, 152, 'Java Script Or Nothing!', 2),
(383, 152, 'JavaScript Object Notation', 3),
(384, 152, 'I dont know', 4),
(385, 153, '1704', 2),
(386, 153, '1703', 3),
(387, 153, '1705', 4),
(388, 153, '1708', 5),
(389, 154, 'Охта', 1),
(390, 154, 'Оккервиль', 2),
(391, 154, 'Волхов', 3),
(392, 154, 'Нева', 4),
(393, 156, 'Доменико Трезини', 1),
(394, 156, 'Василий Баженов', 2),
(395, 156, 'Франческо Растрелли', 3),
(396, 156, 'Доминик Перро', 4),
(397, 157, 'Дворцовый', 1),
(398, 157, 'Синий', 2),
(399, 157, 'Зеленый', 3),
(400, 157, 'Литейный', 4),
(401, 158, 'Парк Горького', 1),
(402, 158, 'Таврический дворец', 2),
(403, 158, 'Памятник Прожевальскому', 3),
(404, 158, 'Третьяковская галерея', 4),
(405, 158, 'Медный всадник', 5),
(406, 158, 'Кремль', 6);

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
(20, 'Основы английского', 'Это тест на базовые знания английского языка', 13, 0, 0, 1),
(21, 'Это анонимный тест без ограничения по времени', 'Это анонимный тест без ограничения по времени', 9, 0, 1, 1),
(23, 'Это не анонимный тест на время', 'Тест вопроса номер 1', 9, 15, 0, 1),
(38, 'Тест на базовые знания Java Script	', 'Это тест для пользователей, которые начинают свое обучение языку Java Script\n', 9, 0, 1, 1),
(39, 'Тест на знание Санкт-Петербурга', 'Этот тест должен выявить насколько пользователь хорошо знает историю города, а также его архитектуру и географические особенности', 9, 10, 0, 1);

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
(32, 0, 'MTUxNzA3NTc1NTQyMg==', 21, NULL, 16777215),
(33, 9, 'MTUxNzA3NTg4MDk2Ng==', 21, NULL, 16777215),
(34, 0, 'MTUxNzA3NTkxNDUyMg==', 21, NULL, 16777215),
(35, 0, 'MTUxNzA3NjA1MzEzMQ==', 21, NULL, 16777215),
(36, 0, 'MTUxNzA3NjIyNDk2NQ==', 21, NULL, 16777215),
(37, 0, 'MTUxNzA3NjI1OTk4Mg==', 21, NULL, 16777215),
(38, 9, 'MTUxNzA3Njg1NjYwOA==', 23, NULL, 16777215),
(39, 0, 'MTUxNzA3Njk5MzAyOQ==', 21, NULL, 16777215),
(40, 13, 'MTUxNzA3NzE5MDQ2MA==', 23, NULL, 16777215),
(41, 9, 'MTUxNzEyOTgyMzk2MQ==', 23, NULL, 16777215),
(42, 9, 'MTUxNzEyOTgzMjM2OQ==', 23, NULL, 16777215),
(43, 0, 'MTUxNzE1MTE0MzAzMQ==', 21, NULL, 16777215),
(44, 0, 'MTUxNzE1Mzg4MzkzMg==', 21, NULL, 16777215),
(45, 0, 'MTUxNzE1NDI2NTE2NA==', 21, NULL, 16777215),
(46, 0, 'MTUxNzE1NTA3OTA0MQ==', 21, NULL, 16777215),
(47, 0, 'MTUxNzE1NTE2NDgwOA==', 21, NULL, 16777215),
(48, 0, 'MTUxNzE1OTA0NDI1MA==', 21, NULL, 16777215),
(49, 0, 'MTUxNzE1OTA5NzgxMw==', 21, NULL, 16777215),
(50, 14, 'MTUxNzE1OTMxMDUwOQ==', 23, NULL, 16777215),
(58, 0, 'MTUxNzE2NDE4NjM4Nw==', 38, NULL, 16777215),
(59, 14, 'MTUxNzI1OTM2NDA1NQ==', 39, NULL, 16777215),
(60, 9, 'MTUxNzI2MDQ0NDExNw==', 39, NULL, 16777215);

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
(13, 'V9110250351@yandex.ru', '$2y$10$uHpO2.3aCSNcbgS.cb2.VOnOMAev2UAjlN4nMZ5wUW8HJNrQTmnFO', '', '', ''),
(14, 'test@test.com', '$2y$10$l4zBQhhiEhuTt6gEluO1me5.cvUA83TZ9v/bzJvJjfQT3qxnkb/7q', '', '', '');

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
(123, 32, 81, '3'),
(124, 32, 82, '1,4'),
(125, 32, 83, 'выфвыф'),
(126, 32, 84, '1'),
(127, 33, 81, '3'),
(128, 33, 82, '1,4'),
(129, 33, 83, 'строка'),
(130, 33, 84, '1'),
(131, 34, 81, '4'),
(132, 34, 82, '1,3'),
(133, 34, 83, 'строка'),
(134, 34, 84, '1'),
(135, 35, 81, '4'),
(136, 35, 82, '1,3'),
(137, 35, 83, 'строка'),
(138, 35, 84, '1'),
(139, 36, 81, '3'),
(140, 36, 82, '2,4'),
(141, 36, 83, 'строка'),
(142, 36, 84, '1'),
(143, 37, 81, '3'),
(144, 37, 82, '1,4'),
(145, 37, 83, 'вфывфв'),
(146, 37, 84, '1'),
(147, 38, 89, '3'),
(148, 38, 90, '3,4'),
(149, 38, 91, 'ffffff'),
(150, 38, 92, '1'),
(151, 39, 81, '3'),
(152, 39, 82, '1,4'),
(153, 39, 83, 'строка'),
(154, 39, 84, '1'),
(155, 40, 89, '3'),
(156, 40, 90, '1,4'),
(157, 40, 91, 'строка'),
(158, 40, 92, '1'),
(159, 43, 81, '3'),
(160, 43, 82, '2'),
(161, 43, 83, 'строка'),
(162, 43, 84, '1'),
(163, 44, 81, '3'),
(164, 44, 82, '1,4'),
(165, 44, 83, 'строка'),
(166, 44, 84, '1'),
(167, 45, 81, '3'),
(168, 45, 82, '1,4'),
(169, 45, 83, ' Строка'),
(170, 45, 84, '1'),
(171, 46, 81, '3'),
(172, 46, 82, '1,4'),
(173, 46, 83, 'Строка'),
(174, 46, 84, '1'),
(175, 47, 81, '3'),
(176, 47, 82, '1,4'),
(177, 47, 83, 'Строка'),
(178, 47, 84, '1'),
(179, 49, 81, '3'),
(180, 49, 82, '1,4'),
(181, 49, 83, 'строка'),
(182, 49, 84, '1'),
(183, 50, 89, '3'),
(184, 50, 90, '1,4'),
(185, 50, 91, 'dasdada'),
(186, 50, 92, '1'),
(212, 58, 149, '3'),
(213, 58, 150, '3,4'),
(214, 58, 151, '-0'),
(215, 58, 152, '3'),
(216, 59, 153, '3'),
(217, 59, 154, '1,2,4'),
(218, 59, 155, 'невский'),
(219, 59, 156, '3'),
(220, 60, 153, '3'),
(221, 60, 154, '1,2,4'),
(222, 60, 155, 'невский'),
(223, 60, 156, '3'),
(224, 60, 158, '2,3,5');

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
  MODIFY `question_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT для таблицы `question_answer`
--
ALTER TABLE `question_answer`
  MODIFY `question_answer_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT для таблицы `question_variant`
--
ALTER TABLE `question_variant`
  MODIFY `question_variant_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=407;

--
-- AUTO_INCREMENT для таблицы `test`
--
ALTER TABLE `test`
  MODIFY `test_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT для таблицы `test_answers`
--
ALTER TABLE `test_answers`
  MODIFY `test_answer_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT для таблицы `user`
--
ALTER TABLE `user`
  MODIFY `user_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `user_answers_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

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

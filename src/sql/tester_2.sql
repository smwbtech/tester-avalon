-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Янв 20 2018 г., 09:33
-- Версия сервера: 10.1.26-MariaDB
-- Версия PHP: 7.1.9

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
('2c6hvqgruttplmi9gguo5irqrr', 'w5ioiwvhxh71qmnlx5ce6f1bp9yuh619', 9, '0000-00-00 00:00:00');

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
(23, 5, 'Что такое переменная?', 1, '', 1),
(24, 5, 'Что из ниже перечисленного относится к структурам данных?', 2, '', 2),
(25, 5, 'Как называется функция которая относится к объекту и описывает его поведение?', 1, '', 3),
(26, 5, 'Напишите, чему в JS будет равняться следующие выражение:\n0 * -1', 3, '', 4),
(32, 7, 'В каком году основан Санкт-Петербург?', 1, '', 1),
(33, 7, 'Кто основал Санкт-Петербург?', 1, '', 2),
(34, 7, 'Какие из этих зданий находятся в Санкт-Петербурге?', 2, '', 3),
(35, 7, 'Главный проспект Санкт-Петербурга?', 3, '', 4),
(36, 7, 'Самый широкий мост в Санкт-Петербурге?', 1, '', 5),
(41, 9, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium libero ac fermentum consectetur. Curabitur dignissim dui nec odio pharetra, in cursus felis tempus. Curabitur auctor, magna ac rhoncus commodo, quam elit laoreet lectus, in consectetur lacus lacus sed augue. Integer vitae efficitur diam. Nulla nec metus nec ipsum tempus sollicitudin euismod et purus. Nam et felis ac arcu eleifend aliquet in vel urna. Morbi elementum ante et nunc malesuada, id finibus enim iaculis. Nullam congue elit elit, in volutpat nunc vestibulum tristique. Quisque vulputate ac quam at scelerisque. In tempor convallis enim vel blandit. Integer sit amet eros ipsum.', 1, '', 1),
(42, 9, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium libero ac fermentum consectetur. Curabitur dignissim dui nec odio pharetra, in cursus felis tempus. Curabitur auctor, magna ac rhoncus commodo, quam elit laoreet lectus, in consectetur lacus lacus sed augue. Integer vitae efficitur diam. Nulla nec metus nec ipsum tempus sollicitudin euismod et purus. Nam et felis ac arcu eleifend aliquet in vel urna. Morbi elementum ante et nunc malesuada, id finibus enim iaculis. Nullam congue elit elit, in volutpat nunc vestibulum tristique. Quisque vulputate ac quam at scelerisque. In tempor convallis enim vel blandit. Integer sit amet eros ipsum.', 2, '', 2),
(43, 9, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium libero ac fermentum consectetur. Curabitur dignissim dui nec odio pharetra, in cursus felis tempus. Curabitur auctor, magna ac rhoncus commodo, quam elit laoreet lectus, in consectetur lacus lacus sed augue. Integer vitae efficitur diam. Nulla nec metus nec ipsum tempus sollicitudin euismod et purus. Nam et felis ac arcu eleifend aliquet in vel urna. Morbi elementum ante et nunc malesuada, id finibus enim iaculis. Nullam congue elit elit, in volutpat nunc vestibulum tristique. Quisque vulputate ac quam at scelerisque. In tempor convallis enim vel blandit. Integer sit amet eros ipsum.', 3, '', 3),
(44, 9, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium libero ac fermentum consectetur. Curabitur dignissim dui nec odio pharetra, in cursus felis tempus. Curabitur auctor, magna ac rhoncus commodo, quam elit laoreet lectus, in consectetur lacus lacus sed augue. Integer vitae efficitur diam. Nulla nec metus nec ipsum tempus sollicitudin euismod et purus. Nam et felis ac arcu eleifend aliquet in vel urna. Morbi elementum ante et nunc malesuada, id finibus enim iaculis. Nullam congue elit elit, in volutpat nunc vestibulum tristique. Quisque vulputate ac quam at scelerisque. In tempor convallis enim vel blandit. Integer sit amet eros ipsum.', 2, '', 4);

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
(23, 23, '1'),
(24, 24, '2,3'),
(25, 25, '2'),
(26, 26, '-0'),
(32, 32, '1'),
(33, 33, '2'),
(34, 34, '2,4'),
(35, 35, 'Невский проспект, невский'),
(36, 36, '1,1'),
(41, 41, '2'),
(42, 42, '1,4'),
(43, 43, 'string, STRING, строка'),
(44, 44, '2,3');

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
(73, 23, 'Ячейка в памяти, где хранится значение', 1),
(74, 23, 'Нечто изменчивое', 2),
(75, 23, 'Я не знаю', 3),
(76, 24, 'Фундамент', 1),
(77, 24, 'Строка', 2),
(78, 24, 'Массив', 3),
(79, 24, 'Квартал', 4),
(80, 25, 'Функция объекта', 1),
(81, 25, 'Метод', 2),
(82, 25, 'Повод', 3),
(83, 25, 'Довод', 4),
(100, 32, '1703', 1),
(101, 32, '1704', 2),
(102, 32, '1702', 3),
(103, 32, '1705', 4),
(104, 33, 'Екатерина 1', 1),
(105, 33, 'Петр 1', 2),
(106, 33, 'Павел', 3),
(107, 33, 'Иван 4', 4),
(108, 34, 'Кремль', 1),
(109, 34, 'Летний сад', 2),
(110, 34, 'Парк Горького', 3),
(111, 34, 'Зимний дворец', 4),
(112, 36, 'Дворцовый', 1),
(113, 36, 'Синий', 1),
(114, 36, 'Литейный', 2),
(115, 36, 'Вантовый', 3),
(127, 41, 'Right', 2),
(128, 41, 'Wrong', 3),
(129, 41, 'Wrong', 4),
(130, 41, 'Wrong', 5),
(131, 42, 'Right', 1),
(132, 42, 'Wrong', 2),
(133, 42, 'Wrong', 3),
(134, 42, 'Right', 4),
(135, 44, 'Wrong', 1),
(136, 44, 'Right', 2),
(137, 44, 'Right', 3),
(138, 44, 'Wrong', 4);

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
(5, 'Тест на основы JavaScript', 'Простой тест на основы JavaScript', 9, 0, 1, 0),
(7, 'Как ты знаешь Петербург?', 'Это тест на знание Санкт-Петербурга', 9, 0, 1, 1),
(9, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium libero ac fermentum consectetur. Curabitur dignissim dui nec odio pharetra,', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium libero ac fermentum consectetur. Curabitur dignissim dui nec odio pharetra, in cursus felis tempus. Curabitur auctor, magna ac rhoncus commodo, quam elit laoreet lectus, in consectetur', 9, 0, 0, 0);

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
(9, 'roman.privalov@gmail.com', '$2y$10$d.J75P5xd53UIvLWzuJ3m.DTd5SQV99jT1SUaAr0n9tfhDNZFjkZO', 'Роман', 'Привалов', '');

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
-- Индексы таблицы `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `question`
--
ALTER TABLE `question`
  MODIFY `question_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT для таблицы `question_answer`
--
ALTER TABLE `question_answer`
  MODIFY `question_answer_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT для таблицы `question_comparison`
--
ALTER TABLE `question_comparison`
  MODIFY `question_comparison_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `question_type`
--
ALTER TABLE `question_type`
  MODIFY `question_type_id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `question_variant`
--
ALTER TABLE `question_variant`
  MODIFY `question_variant_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT для таблицы `statistic`
--
ALTER TABLE `statistic`
  MODIFY `statistic_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `test`
--
ALTER TABLE `test`
  MODIFY `test_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `user`
--
ALTER TABLE `user`
  MODIFY `user_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_test_id` FOREIGN KEY (`question_test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_answer`
--
ALTER TABLE `question_answer`
  ADD CONSTRAINT `question_answe_question_id` FOREIGN KEY (`question_answe_question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_comparison`
--
ALTER TABLE `question_comparison`
  ADD CONSTRAINT `question_comparison_ibfk_1` FOREIGN KEY (`question_comparison_question_id`) REFERENCES `question` (`question_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_variant`
--
ALTER TABLE `question_variant`
  ADD CONSTRAINT `question_variant_question_id` FOREIGN KEY (`question_variant_question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `statistic`
--
ALTER TABLE `statistic`
  ADD CONSTRAINT `statistic_ibfk_1` FOREIGN KEY (`statistic_question_id`) REFERENCES `question` (`question_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `statistic_ibfk_2` FOREIGN KEY (`statictic_user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `test`
--
ALTER TABLE `test`
  ADD CONSTRAINT `test_ibfk_1` FOREIGN KEY (`test_author_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

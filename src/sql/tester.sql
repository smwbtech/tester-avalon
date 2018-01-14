-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Янв 14 2018 г., 23:11
-- Версия сервера: 10.1.21-MariaDB
-- Версия PHP: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
('rr1f2jfnrv3bfmslievspjgskb', 'l5gvln68j7hpnamacc81nhrzr77fpmdo', 9, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `question`
--

CREATE TABLE `question` (
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `question_test_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `question_description` text,
  `question_type_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `question_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `question_answer`
--

CREATE TABLE `question_answer` (
  `question_answer_id` bigint(20) UNSIGNED NOT NULL,
  `question_answe_question_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_answer_answer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `question_variant_text` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `test_anonym` bit(1) DEFAULT b'0',
  `test_staus` bit(1) DEFAULT b'0',
  `test_respondent_id` mediumint(8) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  MODIFY `question_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `question_answer`
--
ALTER TABLE `question_answer`
  MODIFY `question_answer_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
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
  MODIFY `question_variant_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `statistic`
--
ALTER TABLE `statistic`
  MODIFY `statistic_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `test`
--
ALTER TABLE `test`
  MODIFY `test_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT;
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
  ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`question_test_id`) REFERENCES `test` (`test_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_answer`
--
ALTER TABLE `question_answer`
  ADD CONSTRAINT `question_answer_ibfk_1` FOREIGN KEY (`question_answe_question_id`) REFERENCES `question` (`question_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_comparison`
--
ALTER TABLE `question_comparison`
  ADD CONSTRAINT `question_comparison_ibfk_1` FOREIGN KEY (`question_comparison_question_id`) REFERENCES `question` (`question_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `question_variant`
--
ALTER TABLE `question_variant`
  ADD CONSTRAINT `question_variant_ibfk_1` FOREIGN KEY (`question_variant_question_id`) REFERENCES `question` (`question_id`) ON DELETE SET NULL ON UPDATE CASCADE;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

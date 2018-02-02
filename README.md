# Проект tester-avalon

Автоматизация процесса создания, проведения и проверки тестов.
Ведение статистики по тестам и по каждому респонденту.

[Краткий видеообзор работы приложения](https://youtu.be/EkOqrPWb59A)

## Гайд по развертыванию проекта

Актуальный дамп базы данных находится по следующему пути:
> src/sql/tester_2701.sql

Изначально имя базы данных - tester. Если будете создавать базу с отличным именем, необходимо будет внести правки в config.php

Если используете apache: файле vhost необходимо прописать путь до директории dist в котором лежит финальная сборка проекта:
> Пример: DocumentRoot "D:/xampp/htdocs/tester-avalon/dist"
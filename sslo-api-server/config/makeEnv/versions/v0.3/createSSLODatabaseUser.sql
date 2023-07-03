
DROP DATABASE if exists sslo_db;
CREATE DATABASE sslo_db;

DROP USER IF EXISTS 'sslo_user';
CREATE USER 'sslo_user'@'%' IDENTIFIED BY 'tbell0518' PASSWORD EXPIRE NEVER;
GRANT ALL PRIVILEGES ON *.* TO 'sslo_user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';

flush privileges;

use sslo_db;
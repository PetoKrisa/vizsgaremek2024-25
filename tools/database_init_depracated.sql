-- Active: 1732526766833@@127.0.0.1@3306@projekt2425
CREATE DATABASE projekt2425;
USE projekt2425;

CREATE Table city (
id int primary key unique AUTO_INCREMENT,
name varchar(100),
county varchar(100)
);

CREATE Table category(
id int primary key unique auto_increment,
name varchar(30),
description varchar(255)
);

CREATE Table user(
id int primary key unique auto_increment not null,
username varchar(30) unique null,
email varchar(100) unique not null,
password varchar(255) null,
join_date date default now(),
city_id int,
bio varchar(255),
pfp varchar(255),
completed BOOLEAN DEFAULT false,
tempPin int,
role varchar(12),
Foreign Key (city_id) REFERENCES city(id)
)


SET FOREIGN_KEY_CHECKS=1;
DROP TABLE `event`;

CREATE Table event(
id int primary key unique auto_increment,
user_id int,
title varchar(100),
description varchar(1000),
start_date datetime not null,
end_date datetime null,
visibility varchar(10) DEFAULT "public",
cover varchar(255),
city_id int,
location varchar(255),
max_response int null,
age_limit BOOLEAN,
date datetime not null default NOW(),
Foreign Key (city_id) REFERENCES city(id),
Foreign Key (user_id) REFERENCES user(id)
);

CREATE table EventGalleryImage(
    event_id int,
    image varchar(500),
    Foreign Key (event_id) REFERENCES event(id)
);

CREATE TABLE eventCategory(
category_id int,
event_id int,
Foreign Key (category_id) REFERENCES category(id) on delete CASCADE,
Foreign Key (event_id) REFERENCES event(id) on delete CASCADE
);

CREATE Table eventUser(
user_id int,
event_id int,
type VARCHAR(20),
date datetime default NOW(),
Foreign Key (user_id) REFERENCES user(id) on delete CASCADE,
Foreign Key (event_id) REFERENCES event(id) on delete CASCADE
);

CREATE Table eventComment(
id int primary key unique auto_increment,
event_id int,
user_id int,
comment_text varchar(255) not null,
super_comment_id int null DEFAULT null,
date datetime not null default NOW(),
Foreign Key (user_id) REFERENCES user(id) on delete CASCADE,
Foreign Key (event_id) REFERENCES event(id) on delete CASCADE
)


INSERT INTO `user` (id, username, email, password, cityId, role, completed)
VALUES(1, "Admin", "petokrisa2006@gmail.com", "3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2", 340, "admin", true);
INSERT INTO `user` (username, email, password, city_id, role, completed)
VALUES("dummy", "dummy@gmail.com", "3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2", 3572, "user", true);
select * from user;
delete from user;
update user set pfp="test" where id=8;

drop DATABASE projekt2425
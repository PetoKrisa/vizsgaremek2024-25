-- Active: 1739621813955@@127.0.0.1@3306
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


INSERT INTO category (name) VALUES
("koncert"),
("előadás"),
("borkostoló"),
("sport"),
("verseny"),
("fesztivál"),
("pop"),
("jazz"),
("dnb"),
("kiállítás"),
("seminar"),
("online"),
("szinhaz"),
("kultúrális"),
("rock");

INSERT INTO `user` (id, username, email, password, cityId, role, completed)
VALUES(1, "Admin", "petokrisa2006@gmail.com", "3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2", 394, "admin", true);
INSERT INTO `user` (username, email, password, cityId, role, completed)
VALUES("dummy", "dummy@gmail.com", "3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2", 394, "user", true);
select * from user;
select * from `eventcategory`;
delete from user where username="dummy";
select * from eventcomment;

INSERT INTO event (userId, title, description, startDate, endDate, cityId, location, maxResponse) VALUES
(1, 'Tech Conference 2025', 'A global technology conference focusing on AI and innovation.', '2025-06-16 09:00:00', '2025-06-16 17:00:00', 125, 'Grand Hall, City Center', 500),
(1, 'Music Festival', 'A 3-day music festival featuring international artists.', '2025-07-01 10:00:00', '2025-07-03 23:59:59', 350, 'Sunset Park, Downtown', 1000),
(1, 'Art Exhibition', 'A collection of modern art from emerging artists.', '2025-06-18 11:00:00', '2025-06-18 16:00:00', 450, 'Gallery 88, Midtown', 200),
(1, 'Cooking Class', 'Learn how to cook traditional Italian dishes.', '2025-06-20 18:00:00', '2025-06-20 21:00:00', 1450, 'Chef\'s Kitchen, Riverside', 30),
(1, 'Startup Pitch Event', 'Young entrepreneurs pitch their startup ideas to investors.', '2025-06-22 09:00:00', '2025-06-22 18:00:00', 210, 'Innovation Hub, Tech Park', 150),
(1, 'Yoga Retreat', 'A weekend yoga retreat to relax and rejuvenate.', '2025-07-05 08:00:00', '2025-07-07 18:00:00', 1120, 'Mountain Resort, Highlands', 50),
(1, 'Business Networking Event', 'An opportunity to network with industry leaders.', '2025-06-25 12:00:00', '2025-06-25 16:00:00', 850, 'Downtown Business Center', 200),
(1, 'Outdoor Movie Night', 'Enjoy classic movies under the stars.', '2025-06-26 20:00:00', '2025-06-26 23:00:00', 1300, 'Central Park, North Side', 300),
(1, 'Dance Performance', 'A thrilling ballet performance by the city\'s top dancers.', '2025-06-30 19:00:00', '2025-06-30 21:30:00', 530, 'Theatre Royale, City Center', 150),
(1, 'Food Truck Festival', 'Sample dishes from the best local food trucks.', '2025-07-02 10:00:00', '2025-07-02 18:00:00', 1250, 'Market Square, Downtown', 800),
(1, 'Charity Gala', 'A charity event raising funds for local causes.', '2025-06-28 18:00:00', '2025-06-28 23:00:00', 130, 'Crystal Ballroom, Riverfront', 250),
(1, 'Comedy Night', 'An evening of laughter with stand-up comedians.', '2025-07-04 19:00:00', '2025-07-04 22:00:00', 880, 'Laugh Factory, Uptown', 100),
(1, 'Book Club Meetup', 'A gathering of book lovers to discuss the latest bestseller.', '2025-06-27 17:00:00', '2025-06-27 19:00:00', 920, 'Community Center, East Side', 50),
(1, 'Science Fair', 'Explore exciting science exhibits and live experiments.', '2025-07-10 10:00:00', '2025-07-10 17:00:00', 765, 'Expo Hall, South District', 400),
(1, 'Film Screening', 'Watch a screening of a recent indie film with the director Q&A.', '2025-06-29 18:00:00', '2025-06-29 21:00:00', 1700, 'Cineplex Theatre, Downtown', 150),
(1, 'Street Art Festival', 'A celebration of street art and murals across the city.', '2025-07-08 12:00:00', '2025-07-08 18:00:00', 300, 'City Streets, Old Town', 500),
(1, 'Tech Hackathon', 'Join developers and engineers to create innovative solutions.', '2025-07-12 09:00:00', '2025-07-14 18:00:00', 920, 'Tech Labs, Silicon District', 200),
(1, 'Wine Tasting Event', 'Experience a variety of fine wines from across the region.', '2025-07-15 17:00:00', '2025-07-15 20:00:00', 620, 'Vineyard Estate, Hillside', 150),
(1, 'Food and Drink Expo', 'Sample food and beverages from top producers.', '2025-06-24 11:00:00', '2025-06-24 18:00:00', 450, 'Convention Center, West End', 800),
(1, 'Rock Concert', 'Live rock music from top bands across the country.', '2025-07-03 20:00:00', '2025-07-03 23:00:00', 75, 'Stadium Arena, Riverfront', 500),
(1, 'Rock Concert 2', 'Live rock music from top bands across the country.', '2025-07-03 20:00:00', '2025-07-03 23:00:00', 75, 'Stadium Arena, Riverfront', 500),
(1, 'Rock Concert 3', 'Live rock music from top bands across the country.', '2025-07-03 20:00:00', '2025-07-03 23:00:00', 75, 'Stadium Arena, Riverfront', 500),
(1, 'Rock Concert 4', 'Live rock music from top bands across the country.', '2025-07-03 20:00:00', '2025-07-03 23:00:00', 75, 'Stadium Arena, Riverfront', 500),
(1, 'Rock Concert 5', 'Live rock music from top bands across the country.', '2025-07-03 20:00:00', '2025-07-03 23:00:00', 75, 'Stadium Arena, Riverfront', 500);

INSERT INTO eventuser (userId, eventId, type) VALUES
(1, 4, 'view'),
(1, 5, 'view'),
(1, 6, 'view'),
(1, 7, 'view'),
(1, 8, 'view'),
(1, 9, 'view'),
(1, 10, 'view'),
(1, 11, 'view'),
(1, 12, 'view'),
(1, 13, 'view'),
(1, 14, 'view'),
(1, 15, 'view'),
(1, 16, 'view'),
(1, 17, 'view'),
(1, 18, 'view'),
(1, 19, 'view'),
(1, 20, 'view'),
(1, 21, 'view'),
(1, 22, 'view'),
(1, 23, 'view'),
(1, 24, 'view'),
(1, 4, 'view'),
(1, 5, 'view'),
(1, 6, 'view'),
(1, 7, 'view'),
(1, 8, 'view'),
(1, 9, 'view'),
(1, 10, 'view'),
(1, 11, 'view'),
(1, 12, 'view'),
(1, 13, 'view'),
(1, 14, 'view'),
(1, 15, 'view'),
(1, 16, 'view'),
(1, 17, 'view'),
(1, 18, 'view'),
(1, 19, 'view'),
(1, 20, 'view'),
(1, 21, 'view'),
(1, 22, 'view'),
(1, 23, 'view');


INSERT INTO eventcategory (categoryId, eventId) VALUES
(1, 4),
(2, 5),
(3, 6),
(4, 7),
(5, 8),
(6, 9),
(7, 10),
(8, 11),
(9, 12),
(10, 13),
(11, 14),
(12, 15),
(1, 16),
(2, 17),
(3, 18),
(4, 19),
(5, 20),
(6, 21),
(7, 22),
(8, 23),
(9, 24),
(10, 4),
(11, 5),
(12, 6),
(1, 7),
(2, 8),
(3, 9),
(4, 10),
(5, 11),
(6, 12),
(7, 13),
(8, 14),
(9, 15),
(10, 16),
(11, 17),
(12, 18),
(1, 19),
(2, 20),
(3, 21),
(4, 22);

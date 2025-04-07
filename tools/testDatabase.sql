-- Active: 1739621813955@@127.0.0.1@3306@projekt2425
use projekt2425;

DELETE FROM `user`;
DELETE from `eventuser`;
DELETE from `eventcomment`;
DELETE from `eventgalleryimage`;
delete from `eventcategory`;
delete from `event`;

ALTER TABLE user AUTO_INCREMENT = 1;
ALTER TABLE `event` AUTO_INCREMENT = 1;


INSERT INTO `user` (id, username, email, password, cityId, role, completed)
VALUES(1, "Admin", "eventor@petokrisa.hu", "3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2", 394, "admin", true);

INSERT INTO `user` (username, email, password, joinDate, cityId, bio, pfp, completed, tempPin, role, oauthType)
VALUES
('user1', 'user1@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 101, 'Just a regular user.', NULL, true, NULL, 'user', 'email'),
('user2', 'user2@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 102, NULL, NULL, false, 111111, 'user', NULL),
('user3', 'user3@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 103, 'Loves music.', NULL, true, NULL, 'user', NULL),
('user4', 'user4@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 104, NULL, NULL, true, NULL, 'user', 'google'),
('user5', 'user5@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 105, 'Outdoor fan.', NULL, true, 123456, 'user', NULL),
('user6', 'user6@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 106, NULL, NULL, false, NULL, 'user', NULL),
('user7', 'user7@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 107, NULL, NULL, true, NULL, 'admin', NULL),
('user8', 'user8@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 108, 'Party animal.', NULL, true, NULL, 'user', NULL),
('user9', 'user9@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 109, NULL, NULL, true, NULL, 'moderator', NULL),
('user10', 'user10@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 110, NULL, NULL, false, NULL, 'user', NULL),
('user11', 'user11@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 111, NULL, NULL, true, NULL, 'user', NULL),
('user12', 'user12@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 112, NULL, NULL, false, NULL, 'user', NULL),
('user13', 'user13@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 113, NULL, NULL, true, NULL, 'user', NULL),
('user14', 'user14@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 114, NULL, NULL, true, NULL, 'user', NULL),
('user15', 'user15@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 115, NULL, NULL, true, NULL, 'user', NULL),
('user16', 'user16@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 116, NULL, NULL, true, NULL, 'user', NULL),
('user17', 'user17@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 117, NULL, NULL, true, NULL, 'user', NULL),
('user18', 'user18@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 118, NULL, NULL, true, NULL, 'user', NULL),
('user19', 'user19@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 119, NULL, NULL, true, NULL, 'user', NULL),
('user20', 'user20@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 120, NULL, NULL, true, NULL, 'user', NULL),
('user21', 'user21@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 121, NULL, NULL, true, NULL, 'user', NULL),
('user22', 'user22@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 122, NULL, NULL, true, NULL, 'user', NULL),
('user23', 'user23@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 123, NULL, NULL, true, NULL, 'user', NULL),
('user24', 'user24@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 124, NULL, NULL, true, NULL, 'user', NULL),
('user25', 'user25@example.com', '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2', NOW(), 125, NULL, NULL, true, NULL, 'user', NULL);


INSERT INTO `event` (userId, title, description, startDate, endDate, visibility, cover, cityId, location, maxResponse, ageLimit, date)
VALUES
(1, 'Event 1', 'Description for Event 1', NOW() + INTERVAL 1 DAY, NOW() + INTERVAL 2 DAY, 'public', NULL, 201, 'Venue 1', 100, false, NOW()),
(2, 'Event 2', 'Description for Event 2', NOW() + INTERVAL 2 DAY, NOW() + INTERVAL 3 DAY, 'private', NULL, 202, 'Venue 2', 50, true, NOW()),
(3, 'Event 3', 'Description for Event 3', NOW() + INTERVAL 3 DAY, NOW() + INTERVAL 3 DAY, 'friends', NULL, 203, 'Venue 3', 200, false, NOW()),
(4, 'Event 4', 'Description for Event 4', NOW() + INTERVAL 4 DAY, NOW() + INTERVAL 5 DAY, 'public', NULL, 204, 'Venue 4', 75, false, NOW()),
(5, 'Event 5', 'Description for Event 5', NOW() + INTERVAL 5 DAY, NOW() + INTERVAL 6 DAY, 'private', NULL, 205, 'Venue 5', 120, true, NOW()),
(6, 'Event 6', 'Description for Event 6', NOW() + INTERVAL 6 DAY, NOW() + INTERVAL 7 DAY, 'friends', NULL, 206, 'Venue 6', 80, false, NOW()),
(7, 'Event 7', 'Description for Event 7', NOW() + INTERVAL 7 DAY, NOW() + INTERVAL 8 DAY, 'public', NULL, 207, 'Venue 7', 90, false, NOW()),
(8, 'Event 8', 'Description for Event 8', NOW() + INTERVAL 8 DAY, NOW() + INTERVAL 9 DAY, 'private', NULL, 208, 'Venue 8', 40, true, NOW()),
(9, 'Event 9', 'Description for Event 9', NOW() + INTERVAL 9 DAY, NOW() + INTERVAL 10 DAY, 'public', NULL, 209, 'Venue 9', 130, false, NOW()),
(10, 'Event 10', 'Description for Event 10', NOW() + INTERVAL 10 DAY, NOW() + INTERVAL 11 DAY, 'friends', NULL, 210, 'Venue 10', 60, false, NOW()),
(11, 'Event 11', 'Description for Event 11', NOW() + INTERVAL 11 DAY, NOW() + INTERVAL 12 DAY, 'public', NULL, 211, 'Venue 11', 55, false, NOW()),
(12, 'Event 12', 'Description for Event 12', NOW() + INTERVAL 12 DAY, NOW() + INTERVAL 13 DAY, 'private', NULL, 212, 'Venue 12', 150, true, NOW()),
(13, 'Event 13', 'Description for Event 13', NOW() + INTERVAL 13 DAY, NOW() + INTERVAL 14 DAY, 'friends', NULL, 213, 'Venue 13', 30, false, NOW()),
(14, 'Event 14', 'Description for Event 14', NOW() + INTERVAL 14 DAY, NOW() + INTERVAL 15 DAY, 'public', NULL, 214, 'Venue 14', 45, false, NOW()),
(15, 'Event 15', 'Description for Event 15', NOW() + INTERVAL 15 DAY, NOW() + INTERVAL 16 DAY, 'private', NULL, 215, 'Venue 15', 300, true, NOW()),
(16, 'Event 16', 'Description for Event 16', NOW() + INTERVAL 16 DAY, NOW() + INTERVAL 17 DAY, 'public', NULL, 216, 'Venue 16', 50, false, NOW()),
(17, 'Event 17', 'Description for Event 17', NOW() + INTERVAL 17 DAY, NOW() + INTERVAL 18 DAY, 'friends', NULL, 217, 'Venue 17', 70, false, NOW()),
(18, 'Event 18', 'Description for Event 18', NOW() + INTERVAL 18 DAY, NOW() + INTERVAL 19 DAY, 'public', NULL, 218, 'Venue 18', 110, false, NOW()),
(19, 'Event 19', 'Description for Event 19', NOW() + INTERVAL 19 DAY, NOW() + INTERVAL 20 DAY, 'private', NULL, 219, 'Venue 19', 90, true, NOW()),
(20, 'Event 20', 'Description for Event 20', NOW() + INTERVAL 20 DAY, NOW() + INTERVAL 21 DAY, 'public', NULL, 220, 'Venue 20', 60, false, NOW()),
(21, 'Event 21', 'Description for Event 21', NOW() + INTERVAL 21 DAY, NOW() + INTERVAL 22 DAY, 'friends', NULL, 221, 'Venue 21', 70, false, NOW()),
(22, 'Event 22', 'Description for Event 22', NOW() + INTERVAL 22 DAY, NOW() + INTERVAL 23 DAY, 'public', NULL, 222, 'Venue 22', 95, false, NOW()),
(23, 'Event 23', 'Description for Event 23', NOW() + INTERVAL 23 DAY, NOW() + INTERVAL 24 DAY, 'private', NULL, 223, 'Venue 23', 85, true, NOW()),
(24, 'Event 24', 'Description for Event 24', NOW() + INTERVAL 24 DAY, NOW() + INTERVAL 25 DAY, 'friends', NULL, 224, 'Venue 24', 45, false, NOW()),
(4, 'Event 25', 'Description for Event 25', NOW() + INTERVAL 25 DAY, NOW() + INTERVAL 26 DAY, 'public', NULL, 225, 'Venue 25', 150, false, NOW());

INSERT INTO `eventuser` (userId, eventId, type)
VALUES
-- views
(2, 1, 'view'),
(3, 2, 'view'),
(4, 3, 'view'),
(5, 4, 'view'),
(6, 5, 'view'),
(7, 6, 'view'),
(8, 7, 'view'),
(9, 8, 'view'),
(10, 9, 'view'),
(11, 10, 'view'),
(12, 11, 'view'),
(13, 12, 'view'),
(14, 13, 'view'),
(15, 14, 'view'),
(16, 15, 'view'),
(17, 16, 'view'),
(18, 17, 'view'),
(19, 18, 'view'),
(20, 19, 'view'),
(21, 20, 'view'),
(22, 21, 'view'),
(23, 22, 'view'),
(24, 23, 'view'),
(25, 24, 'view'),
(1, 25, 'view');

INSERT INTO `eventuser` (userId, eventId, type)
VALUES
-- responses
(2, 2, 'response'),
(3, 3, 'response'),
(4, 4, 'response'),
(5, 5, 'response'),
(6, 6, 'response'),
(7, 7, 'response'),
(8, 8, 'response'),
(9, 9, 'response'),
(10, 10, 'response'),
(11, 11, 'response'),
(12, 12, 'response'),
(13, 13, 'response'),
(14, 14, 'response'),
(15, 15, 'response'),
(16, 16, 'response'),
(17, 17, 'response'),
(18, 18, 'response'),
(19, 19, 'response'),
(20, 20, 'response'),
(21, 21, 'response'),
(22, 22, 'response'),
(23, 23, 'response'),
(24, 24, 'response'),
(25, 25, 'response'),
(1, 1, 'response');

INSERT INTO `eventcategory` (eventId, categoryId)
VALUES
(1, 3),
(1, 8),
(2, 1),
(2, 5),
(2, 12),
(3, 6),
(4, 10),
(4, 13),
(5, 4),
(6, 2),
(6, 15),
(7, 7),
(8, 11),
(8, 14),
(9, 1),
(9, 9),
(9, 3),
(10, 2),
(10, 13),
(11, 5),
(12, 6),
(12, 15),
(13, 8),
(14, 10),
(15, 12),
(15, 4),
(16, 7),
(17, 3),
(17, 14),
(18, 11),
(18, 6),
(19, 2),
(20, 9),
(21, 13),
(21, 5),
(22, 1),
(22, 12),
(23, 15),
(23, 8),
(24, 10),
(24, 7),
(25, 4),
(25, 2);

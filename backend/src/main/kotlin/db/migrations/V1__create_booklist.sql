CREATE TABLE `booklist` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `name` varchar(50),
  `description` varchar(255)
);
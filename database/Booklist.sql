CREATE TABLE `booklist` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `name` varchar(50),
  `description` varchar(255)
);

CREATE TABLE `booklist_books` (
  `id` integer PRIMARY KEY,
  `isbn` varchar(255) NOT NULL,
  `booklist_id` integer NOT NULL
);


ALTER TABLE `booklist_books` ADD FOREIGN KEY (`booklist_id`) REFERENCES `booklist` (`id`);


INSERT INTO booklist (user_id, name) VALUES (1, 'Read Next');
INSERT INTO booklist (user_id, name) VALUES (1, 'Current Reading');
INSERT INTO booklist (user_id, name) VALUES (1, 'Favorites');
INSERT INTO booklist (user_id, name, description) VALUES (1, 'Loved!', 'Loved this books!!');

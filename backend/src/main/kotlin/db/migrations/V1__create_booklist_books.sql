CREATE TABLE `booklist_books` (
  `id` integer PRIMARY KEY,
  `isbn` varchar(255) NOT NULL,
  `booklist_id` integer NOT NULL
);

ALTER TABLE `booklist_books` ADD FOREIGN KEY (`booklist_id`) REFERENCES `booklist` (`id`);

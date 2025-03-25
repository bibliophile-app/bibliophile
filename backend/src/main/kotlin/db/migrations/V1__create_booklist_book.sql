CREATE TABLE `booklist_books` (
  `id` integer PRIMARY KEY,
  `isbn` varchar(13) NOT NULL,
  `booklist_id` integer NOT NULL,

  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `booklist_books` ADD FOREIGN KEY (`booklist_id`) REFERENCES `booklists` (`id`);

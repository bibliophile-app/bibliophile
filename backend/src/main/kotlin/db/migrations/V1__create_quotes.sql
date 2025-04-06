CREATE TABLE `booklists` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `content` varchar(255) NOT NULL,

  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
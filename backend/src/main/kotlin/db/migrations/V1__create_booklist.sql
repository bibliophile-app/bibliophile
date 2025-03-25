CREATE TABLE `booklists` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `list_name` varchar(50) NOT NULL,
  `list_description` varchar(255)

  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
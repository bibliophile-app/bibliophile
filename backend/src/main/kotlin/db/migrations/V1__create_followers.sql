CREATE TABLE `booklists` (
  `id` integer PRIMARY KEY,
  `following_user_id` integer NOT NULL,
  `followed_user_id` integer NOT NULL,

  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
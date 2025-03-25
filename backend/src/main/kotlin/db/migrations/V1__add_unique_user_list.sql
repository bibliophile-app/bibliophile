ALTER TABLE `booklists`
ADD CONSTRAINT `unique_user_list` UNIQUE (`user_id`, `list_name`);

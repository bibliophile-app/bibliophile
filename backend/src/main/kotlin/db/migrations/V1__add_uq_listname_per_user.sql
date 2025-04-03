ALTER TABLE `booklists`
ADD CONSTRAINT `uq_listname_per_user` UNIQUE (`user_id`, `list_name`);

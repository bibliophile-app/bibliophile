ALTER TABLE `booklist_books`
ADD CONSTRAINT `uq_book_per_list` UNIQUE (`isbn`, `booklist_id`);

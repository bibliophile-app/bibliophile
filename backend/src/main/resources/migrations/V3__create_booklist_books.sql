CREATE TABLE booklist_books (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(13) NOT NULL,
  booklist_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uq_book_per_list (isbn, booklist_id),
  FOREIGN KEY (booklist_id) REFERENCES booklists(id) ON DELETE CASCADE
);
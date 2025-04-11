CREATE TABLE reviews (
  id integer PRIMARY KEY,
  isbn varchar(13) NOT NULL,
  user_id integer NOT NULL,
  content varchar(255) NOT NULL,
  rating integer NOT NULL,
  favorite boolean NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
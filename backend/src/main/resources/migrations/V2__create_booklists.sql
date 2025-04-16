CREATE TABLE booklists (
  id integer PRIMARY KEY,
  user_id integer NOT NULL,
  list_name varchar(50) NOT NULL,
  list_description varchar(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_listname_per_user (user_id, list_name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
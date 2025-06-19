-- Para encontrar review do próprio usuário
CREATE INDEX idx_reviews_user_book ON reviews (user_id, book_id);

-- Para encontrar reviews dos amigos
CREATE INDEX idx_reviews_book_user ON reviews (book_id, user_id);

-- Para encontrar as reviews mais recentes do livro
CREATE INDEX idx_reviews_book_reviewedat ON reviews (book_id, reviewed_at DESC);

-- Para JOIN com tabela de amizades
CREATE INDEX idx_followers_follower_followee ON followers (follower_id, followee_id);
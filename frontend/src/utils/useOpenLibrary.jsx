import { useState } from 'react';

const BASE_REQUEST_URL = 'https://openlibrary.org';
const BASE_COVER_URL = 'https://covers.openlibrary.org'

// Hook para gerenciar requisições à OpenLibrary
const useOpenLibrary = ({ language = 'en', onResults, onError }) => {
  const [loading, setLoading] = useState(false);

  // Função para buscar detalhes de um único livro por OLID
  async function fetchBookByOLID(olid) {
    setLoading(true);
    try {
      const url = `${BASE_REQUEST_URL}/books/${olid}.json`;
      const response = await fetch(url);
      const data = await response.json();

      const coverUrl = `${BASE_COVER_URL}/b/olid/${olid}-M.jpg`

      const book =({
        olid: olid,
        title: data.title,
        description: data.description,
        coverUrl: coverUrl,
        publish_year: data.first_publish_year
      })

      onResults(book);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  }

  // Função para buscar livros com base em uma query
  async function fetchBooks(query) {
    setLoading(true);
    try {
      const url = `${BASE_REQUEST_URL}/search.json?q=${query}&fields=key,title,author_name,cover_edition_key&lang=${language}`;
      const response = await fetch(url);
      const data = await response.json();

      const books = data.docs
        .filter((book) =>
          Array.isArray(book.author_name) &&
          book.author_name.length > 0 &&
          book.cover_edition_key
        )
        .map((book) => ({
          title: book.title,
          author: book.author_name.join(', '),
          olid: book.cover_edition_key,
          coverUrl: `${BASE_COVER_URL}/b/olid/${book.cover_edition_key}-M.jpg`,
      }));

      onResults(books);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  }

  // Função principal que decide qual requisição fazer
  async function fetchResults(query, olid = null) {
    if (olid) {
      await fetchBookByOLID(olid);
    } else {
      await fetchBooks(query);
    }
  }

  return {
    fetchResults,
    loading,
  };
};

export default useOpenLibrary;
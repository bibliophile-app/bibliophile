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
      const url = `${BASE_REQUEST_URL}/olid/${olid}.json`;
      const response = await fetch(url);
      const data = await response.json();

      const coverId = data.covers ? data.covers[0] : null;
      const coverUrl = coverId
        ? `${BASE_COVER_URL}/b/olid/${coverId}-L.jpg`
        : null;

      onResults({ ...data, coverUrl });
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

      const books = data.docs.map((book) => ({
        title: book.title,
        author: book.author_name ? book.author_name[0] : 'Unknown',
        olid: book.cover_edition_key,
        coverUrl: book.cover_edition_key
          ? `${BASE_COVER_URL}/b/olid/${book.cover_edition_key}-M.jpg`
          : null,
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
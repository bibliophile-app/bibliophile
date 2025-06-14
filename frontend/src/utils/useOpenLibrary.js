import { useState, useRef } from 'react';

const BASE_REQUEST_URL = 'https://openlibrary.org';
const BASE_COVER_URL = 'https://covers.openlibrary.org';

function useOpenLibrary({ language = 'pt-br', onError }) {
  const [loading, setLoading] = useState(false);
  const olidCache = useRef(new Map());

  async function fetchBookByOLID(olid) {
    if (olidCache.current.has(olid)) {
      return olidCache.current.get(olid);
    }

    setLoading(true);
    try {
      const bookRes = await fetch(`${BASE_REQUEST_URL}/books/${olid}.json`);
      if (!bookRes.ok) throw new Error('Livro não encontrado.');

      const bookData = await bookRes.json();
      const workKey = bookData.works?.[0]?.key;
      const workId = workKey?.split('/').pop();

      let workData = {};
      if (workId) {
        const workRes = await fetch(`${BASE_REQUEST_URL}${workKey}.json`);
        workData = await workRes.json();
      }

      let authorNames = [bookData?.by_statement];
      if (bookData.authors?.length) {
        const authorFetches = bookData.authors.map(async (author) => {
          const authorKey = author.key;
          const authorRes = await fetch(`${BASE_REQUEST_URL}${authorKey}.json`);
          const authorData = await authorRes.json();
          return authorData.name;
        });
        authorNames = await Promise.all(authorFetches);
      }

      const coverUrl = `${BASE_COVER_URL}/b/olid/${olid}-M.jpg`;

      const book = {
        id: olid,
        title: bookData.title || workData.title || 'Título não disponível.',
        description:
          bookData.description ||
          workData.description ||
          'Descrição não disponível.',
        coverUrl,
        publish_year:
          bookData.publish_date || workData.first_publish_date || null,
        authors: authorNames.join(', '),
      };

      olidCache.current.set(olid, book);
      return book;
    } catch (error) {
      onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

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
          id: book.cover_edition_key,
          title: book.title,
          authors: book.author_name.join(', '),
          coverUrl: `${BASE_COVER_URL}/b/olid/${book.cover_edition_key}-M.jpg`,
        }));

      return books;
    } catch (error) {
      onError?.(error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function fetchResults(query, olid = null) {
    if (olid) {
      return await fetchBookByOLID(olid);
    } else {
      return await fetchBooks(query);
    }
  }

  return {
    fetchResults,
    loading,
  };
};

export default useOpenLibrary;
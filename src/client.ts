import axios from "axios";

// export type Book = {
//   title     String
//   author    String
//   pages     Int
//   isbn10    String?
//   isbn13    String?
//   coverUrl  String?
// }

export interface Book {
  title: string;
  author: string;
  pages: number;
  isbn10?: string;
  isbn13?: string;
  coverUrl: string;
}

export interface BookResponse {
  title: string;
  authors: {
    name: string;
    url: string;
  }[];
  url: string;
  cover: {
    small: string;
    medium: string;
    large: string;
  };
  identifiers: {
    isbn_10: string[];
    isbn_13: string[];
  };
  number_of_pages: number;
  publish_date: string;
}

export interface BookDoc {
  title: string;
  isbn: string[];
  author_name: string[];
  number_of_pages_median: number;
  cover_i: number;
}

export interface BookSearchResult {
  docs: BookDoc[];
  numFound: number;
  numFoundExact: boolean;
  start: number;
  q: string;
}

export const getBookByIsbn = async (isbn: string) => {
  interface Response {
    [key: string]: BookResponse;
  }
  const { data } = await axios.get<Response>(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
  );

  const bookResponseParsed =
    Object.keys(data).length > 0 ? data[`ISBN:${isbn}`] : null;

  const book = {} as Book;

  if (bookResponseParsed) {
    book.title = bookResponseParsed.title;
    book.author = bookResponseParsed.authors
      ? bookResponseParsed.authors[0]
        ? bookResponseParsed.authors[0].name
        : ""
      : "";
    book.pages = bookResponseParsed.number_of_pages;
    book.isbn10 = bookResponseParsed.identifiers.isbn_10[0];
    book.isbn13 = bookResponseParsed.identifiers.isbn_13[0];
    book.coverUrl = bookResponseParsed.cover.large;
  }

  return bookResponseParsed ? book : null;
};

export const getBookByTitle = async (title: string) => {
  const { data } = await axios.get<BookSearchResult>(
    `https://openlibrary.org/search.json?title=${title}`
  );

  const books = data.docs.map((doc) => {
    const book = {} as Book;

    book.title = doc.title;
    book.author = doc.author_name[0] ? doc.author_name[0] : "";
    book.pages = doc.number_of_pages_median;
    book.isbn10 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 10) : "";
    book.isbn13 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 13) : "";
    book.coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;

    return book;
  });

  return books;
};

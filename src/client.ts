import axios from "axios";

export interface Book {
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

export const getBooks = async (searchType: "isbn" | "title", input: string) => {
  interface Response {
    [key: string]: Book;
  }
  if (searchType === "isbn") {
    const { data } = await axios.get<Response>(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${input}&format=json&jscmd=data`
    );

    const book = Object.keys(data).length > 0 ? data[`ISBN:${input}`] : null;

    console.log(book);

    return book ? book : null;
  } else {
    const { data } = await axios.get<BookSearchResult>(
      `https://openlibrary.org/search.json?title=${input}`
    );

    console.log(data);
    return data;
  }
};

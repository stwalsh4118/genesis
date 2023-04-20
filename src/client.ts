import axios from "axios";
import { api } from "./utils/api";
import { toast } from "react-toastify";

export interface Book {
  title: string;
  author: string;
  pages?: number;
  isbn10?: string;
  isbn13?: string;
  coverUrl?: string;
  rating?: number;
  review?: string;
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
    book.pages = bookResponseParsed.number_of_pages
      ? bookResponseParsed.number_of_pages
      : 0;
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
    book.pages = doc.number_of_pages_median ? doc.number_of_pages_median : 0;
    book.isbn10 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 10) : "";
    book.isbn13 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 13) : "";
    book.coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;

    return book;
  });

  return books;
};

export const getBookByAuthor = async (author: string) => {
  const { data } = await axios.get<BookSearchResult>(
    `https://openlibrary.org/search.json?author=${author}`
  );

  const books = data.docs.map((doc) => {
    const book = {} as Book;

    book.title = doc.title;
    book.author = doc.author_name[0] ? doc.author_name[0] : "";
    book.pages = doc.number_of_pages_median ? doc.number_of_pages_median : 0;
    book.isbn10 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 10) : "";
    book.isbn13 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 13) : "";
    book.coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;

    return book;
  });

  return books;
};

export const useAddBooksToCollection = () => {
  const addBooksToCollection =
    api.user_collections.addBooksToCollection.useMutation({
      onSuccess: () => {
        toast.success("Book added to collection");
      },
      onError: () => {
        toast.error("Failed to add book to collection");
      },
    });

  return addBooksToCollection;
};

export const useRemoveBooksFromCollection = () => {
  const removeBooksFromCollection =
    api.user_collections.removeBooksFromCollection.useMutation({
      onSuccess: () => {
        toast.success("Book removed from collection");
      },
      onError: () => {
        toast.error("Failed to remove book from collection");
      },
    });

  return removeBooksFromCollection;
};

export const useDeleteBook = () => {
  const deleteBook = api.user_books.deleteBook.useMutation({
    onSuccess: () => {
      toast.success("Book deleted");
    },
    onError: () => {
      toast.error("Failed to delete book");
    },
  });

  return deleteBook;
};

export const useUpdateBook = () => {
  const updateBook = api.user_books.updateBook.useMutation({
    onSuccess: () => {
      toast.success("Book updated");
    },
    onError: () => {
      toast.error("Failed to update book");
    },
  });

  return updateBook;
};

export const useAddCollection = () => {
  const addCollection = api.user_collections.addCollection.useMutation({
    onSuccess: () => {
      toast.success("Collection added");
    },
    onError: () => {
      toast.error("Failed to add collection");
    },
  });

  return addCollection;
};

export const useDeleteCollection = () => {
  const deleteCollection = api.user_collections.deleteCollection.useMutation({
    onSuccess: () => {
      toast.success("Collection deleted");
    },
    onError: () => {
      toast.error("Failed to delete collection");
    },
  });

  return deleteCollection;
};

export const useUpdateGroup = () => {
  const updateGroup = api.group.updateGroup.useMutation({
    onSuccess: () => {
      toast.success("Group updated");
    },
    onError: () => {
      toast.error("Failed to update group");
    },
  });

  return updateGroup;
};

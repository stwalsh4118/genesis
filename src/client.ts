import axios from "axios";
import { api } from "./utils/api";
import { toast } from "react-toastify";
import { matchGenres } from "./utils/client_utils";
import { useRouter } from "next/router";

export interface Book {
  title: string;
  author: string;
  pages?: number;
  isbn10?: string;
  isbn13?: string;
  coverUrl?: string;
  rating?: number;
  review?: string;
  pagesRead?: number;
  genres?: string[];
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
  subjects: {
    name: string;
    url: string;
  }[];
}

export interface BookDoc {
  title: string;
  isbn: string[];
  author_name: string[];
  number_of_pages_median: number;
  cover_i: number;
  subject: string[];
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

  console.log(bookResponseParsed);

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
    const genres = matchGenres(
      bookResponseParsed.subjects.map((subject) => subject.name)
    );
    book.genres = genres.length > 0 ? genres : ["N/A"];
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
    const genres = matchGenres(doc.subject);
    book.genres = genres.length > 0 ? genres : ["N/A"];

    return book;
  });

  return books;
};

export const getBookByAuthor = async (author: string) => {
  const { data } = await axios.get<BookSearchResult>(
    `https://openlibrary.org/search.json?author=${author}`
  );

  console.log(data);

  const books = data.docs.map((doc) => {
    const book = {} as Book;

    book.title = doc.title;
    book.author = doc.author_name[0] ? doc.author_name[0] : "";
    book.pages = doc.number_of_pages_median ? doc.number_of_pages_median : 0;
    book.isbn10 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 10) : "";
    book.isbn13 = doc.isbn ? doc.isbn.find((isbn) => isbn.length === 13) : "";
    book.coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
    const genres = matchGenres(doc.subject);
    book.genres = genres.length > 0 ? genres : ["N/A"];

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

export const useAddUserToGroup = () => {
  const router = useRouter();
  const addUserToGroup = api.group.addUserToGroup.useMutation({
    onSuccess: () => {
      toast.success("User added to group");
      void router.push("/groups");
    },
    onError: () => {
      toast.error("Failed to add user to group");
    },
  });

  return addUserToGroup;
};

export const useAddBookToGroupCollection = () => {
  const addBookToGroupCollection =
    api.group_collections.addBookToGroupCollection.useMutation({
      onSuccess: () => {
        toast.success("Book added to group collection");
      },
      onError: () => {
        toast.error("Failed to add book to group collection");
      },
    });

  return addBookToGroupCollection;
};

export const useAddBookToGroupCollectionById = () => {
  const addBookToGroupCollectionById =
    api.group_collections.addBookToGroupCollectionById.useMutation({
      onSuccess: () => {
        toast.success("Book added to group collection");
      },
      onError: () => {
        toast.error("Failed to add book to group collection");
      },
    });

  return addBookToGroupCollectionById;
};

export const useAddBookToGroupCollectionByCollectionId = () => {
  const addBookToGroupCollectionByCollectionId =
    api.group_collections.addBookToGroupCollectionByCollectionId.useMutation({
      onSuccess: () => {
        toast.success("Book added to group collection");
      },
      onError: () => {
        toast.error("Failed to add book to group collection");
      },
    });

  return addBookToGroupCollectionByCollectionId;
};

export const useCreateGroup = () => {
  const router = useRouter();

  const createGroup = api.group.addGroup.useMutation({
    onSuccess: () => {
      toast.success("Group created");
      void router.push("/groups");
    },
    onError: () => {
      toast.error("Failed to create group");
    },
  });

  return createGroup;
};

export const useCreateGroupCollection = () => {
  const createGroupCollection =
    api.group_collections.addGroupCollection.useMutation({
      onSuccess: () => {
        toast.success("Collection created");
      },
      onError: () => {
        toast.error("Failed to create collection");
      },
    });

  return createGroupCollection;
};

export const useDeleteBookFromGroupCollection = () => {
  const deleteBookFromGroupCollection =
    api.group_collections.deleteBookFromGroupCollection.useMutation({
      onSuccess: () => {
        toast.success("Book deleted from group collection");
      },
      onError: () => {
        toast.error("Failed to delete book from group collection");
      },
    });

  return deleteBookFromGroupCollection;
};

export const useDeleteGroupBook = () => {
  const deleteGroupBook = api.group_books.deleteGroupBook.useMutation({
    onSuccess: () => {
      toast.success("Book deleted from group");
    },
    onError: () => {
      toast.error("Failed to delete book from group");
    },
  });

  return deleteGroupBook;
};

export const useDeleteGroupCollection = () => {
  const deleteGroupCollection =
    api.group_collections.deleteGroupCollection.useMutation({
      onSuccess: () => {
        toast.success("Collection deleted");
      },
      onError: () => {
        toast.error("Failed to delete collection");
      },
    });

  return deleteGroupCollection;
};

export const useDeleteGroup = () => {
  const router = useRouter();

  const deleteGroup = api.group.deleteGroup.useMutation({
    onSuccess: () => {
      toast.success("Group deleted");
      void router.push("/groups");
    },
    onError: () => {
      toast.error("Failed to delete group");
    },
  });

  return deleteGroup;
};

export const useUpdateGroupBook = () => {
  const updateGroupBook = api.group_books.updateGroupBook.useMutation({
    onSuccess: () => {
      toast.success("Book updated");
    },
    onError: () => {
      toast.error("Failed to update book");
    },
  });

  return updateGroupBook;
};

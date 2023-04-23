import { getBookByAuthor, getBookByIsbn, getBookByTitle } from "@/client";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { BookDisplay } from "@/components/BookDisplay/BookDisplay";
import { useSession } from "next-auth/react";
import { useOutsideAlerter } from "../collections";
import { Group } from "@prisma/client";

const Search: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [formData, setFormData] = useState("");
  const [searchDropdownActive, setSearchDropdownActive] = useState(false);
  const [searchType, setSearchType] = useState<"ISBN" | "Title" | "Author">(
    "Title"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const dropdown = useRef(null);
  useOutsideAlerter(dropdown, () => setSearchDropdownActive(false));

  const query = useQueries({
    queries: [
      {
        queryKey: ["isbn", formData],
        queryFn: () => getBookByIsbn(formData),
        enabled: searchType === "ISBN" && formData.length > 0,
      },
      {
        queryKey: ["title", formData],
        queryFn: () => getBookByTitle(formData),
        enabled: searchType === "Title" && formData.length > 0,
      },
      {
        queryKey: ["author", formData],
        queryFn: () => getBookByAuthor(formData),
        enabled: searchType === "Author" && formData.length > 0,
      },
    ],
  });
  const addBookEvent = api.events.addBookStartedEvent.useMutation();

  const { data: events } = api.events.getEvents.useQuery();
  const addBook = api.user_books.addBook.useMutation({
    onSuccess: (data) => {
      toast.success("Book added to your collection");
      addBookEvent.mutate({
        bookId: data.id,
      });
    },
    onError: () => {
      toast.error("Failed to add book to your collection");
    },
  });
  const addBookToGroup =
    api.group_collections.addBookToGroupCollection.useMutation({
      onSuccess: () => {
        toast.success("Book added to group collection");
      },
      onError: () => {
        toast.error("Failed to add book to group collection");
      },
    });

  const { data: collections } = api.user_collections.getCollections.useQuery({
    userId: session?.user.id ? session.user.id : "",
  });
  const { data: groups } = api.group.getGroups.useQuery();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("search"));
    setFormData(formData.get("search") as string);
    await queryClient.invalidateQueries([searchType, formData.get("search")]);
  };

  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        {/* search wrapper */}
        <div className="flex h-full w-full flex-col p-2 md:w-[70%]">
          {/* search bar */}
          <div className="relative w-full">
            {(!query?.every((query) => query.isFetching) &&
              !query?.every((query) => query.isLoading)) ||
            formData.length === 0 ? (
              <MagnifyingGlassIcon className="absolute right-4 my-7 h-8 w-8 text-sage-700"></MagnifyingGlassIcon>
            ) : (
              <div className="absolute right-4 my-7 h-8 w-8 animate-spin rounded-full border-b-2 border-sage-700"></div>
            )}
            <form onSubmit={(e) => void handleSearch(e)}>
              <input
                type="search"
                placeholder="Search by"
                className="my-4 h-14 w-full rounded-sm bg-sage-300 p-2 text-2xl text-sage-700 outline-none placeholder:text-sage-800/50 focus:outline-sage-600"
                name="search"
                id="search"
                autoComplete="off"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
            </form>
            {!searchQuery ? (
              <div className="absolute top-0 left-0 my-7 ml-[7.2rem] flex h-8 w-fit items-center justify-center">
                <div className="relative h-fit w-full">
                  <div
                    className="button flex h-full w-full items-center justify-center rounded-md border-[1px] border-sage-700/20 p-1 text-2xl text-sage-800/50 shadow-sm"
                    onClick={() =>
                      setSearchDropdownActive(!searchDropdownActive)
                    }
                  >
                    <div>{searchType}</div>
                    <ChevronDownIcon className="ml-[.1rem] h-[1.25rem] w-[1.25rem] text-sage-800/50"></ChevronDownIcon>
                  </div>
                  {searchDropdownActive ? (
                    <div
                      ref={dropdown}
                      className="absolute mt-1 flex h-fit w-24 flex-col divide-y-[1px] divide-sage-600/40 border border-sage-500/50 bg-sage-400 px-1 text-sage-800 shadow-sm"
                    >
                      <div
                        onClick={() => {
                          setSearchType("Title");
                          setSearchDropdownActive(false);
                        }}
                        className="button py-1 hover:bg-sage-500/50"
                      >
                        Title
                      </div>
                      <div
                        onClick={() => {
                          setSearchType("ISBN");
                          setSearchDropdownActive(false);
                        }}
                        className="button py-1 hover:bg-sage-500/50"
                      >
                        ISBN
                      </div>
                      <div
                        onClick={() => {
                          setSearchType("Author");
                          setSearchDropdownActive(false);
                        }}
                        className="button py-1 hover:bg-sage-500/50"
                      >
                        Author
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          {/* search results */}
          <div className="w-full">
            {query.some((query) => query.data) &&
            !query.every((query) => query.error) ? (
              <>
                <div className="flex max-h-[calc(100vh-8rem)] w-full flex-col divide-y divide-sage-400 overflow-y-scroll rounded-sm bg-sage-300 px-2 pt-2">
                  {/* search result component */}
                  {query.map((query) => {
                    if (query.data) {
                      if (Array.isArray(query.data)) {
                        return query.data.map((book, index) => {
                          return (
                            <BookDisplay
                              key={index}
                              leftSlot={
                                <BookDisplay.Image
                                  imageUrl={book.coverUrl ? book.coverUrl : ""}
                                />
                              }
                              middleSlot={
                                <div className="flex h-full flex-col justify-between text-center">
                                  <BookDisplay.Title title={book.title} />
                                  <BookDisplay.Author author={book.author} />
                                </div>
                              }
                              rightSlot={
                                <div className="flex h-full flex-col items-end justify-between">
                                  <BookDisplay.Pages
                                    pages={book.pages ? book.pages : 0}
                                  />
                                  <BookDisplay.AddBookButton
                                    addBook={addBook}
                                    addBookToGroup={addBookToGroup}
                                    book={book}
                                    defaultCollectionId={
                                      collections?.collections.find(
                                        (collection) =>
                                          collection.name === "All"
                                      )?.id
                                        ? collections.collections.find(
                                            (collection) =>
                                              collection.name === "All"
                                          )?.id
                                        : ""
                                    }
                                    groups={groups as unknown as Group[]}
                                  />
                                  <div className="flex flex-col items-end">
                                    <BookDisplay.ISBN10
                                      isbn10={book.isbn10 ? book.isbn10 : ""}
                                    />
                                    <BookDisplay.ISBN13
                                      isbn13={book.isbn13 ? book.isbn13 : ""}
                                    />
                                  </div>
                                </div>
                              }
                            ></BookDisplay>
                          );
                        });
                      }
                      return (
                        <BookDisplay
                          key={query.data.title}
                          leftSlot={
                            <BookDisplay.Image
                              imageUrl={
                                query.data.coverUrl ? query.data.coverUrl : ""
                              }
                            />
                          }
                          middleSlot={
                            <div className="flex flex-col justify-between">
                              <BookDisplay.Title title={query.data.title} />
                              <BookDisplay.Author author={query.data.author} />
                            </div>
                          }
                          rightSlot={
                            <div className="flex h-full flex-col items-end justify-between">
                              <BookDisplay.Pages
                                pages={query.data.pages ? query.data.pages : 0}
                              />
                              <BookDisplay.AddBookButton
                                addBook={addBook}
                                addBookToGroup={addBookToGroup}
                                book={query.data}
                                defaultCollectionId={
                                  collections?.collections.find(
                                    (collection) => collection.name === "All"
                                  )?.id
                                    ? collections.collections.find(
                                        (collection) =>
                                          collection.name === "All"
                                      )?.id
                                    : ""
                                }
                                groups={groups as unknown as Group[]}
                              />
                              <div className="flex flex-col items-end">
                                <BookDisplay.ISBN10
                                  isbn10={
                                    query.data.isbn10 ? query.data.isbn10 : ""
                                  }
                                />
                                <BookDisplay.ISBN13
                                  isbn13={
                                    query.data.isbn13 ? query.data.isbn13 : ""
                                  }
                                />
                              </div>
                            </div>
                          }
                        ></BookDisplay>
                      );
                    }
                  })}
                </div>
                <div className="h-2 w-full bg-sage-300"></div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;

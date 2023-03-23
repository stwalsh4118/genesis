import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { BookDisplay } from "@/components/BookDisplay/BookDisplay";
import {
  ChevronDownIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import Fuse from "fuse.js";
import type { Book } from "@prisma/client";

import { toast } from "react-toastify";

export const useOutsideAlerter = (
  ref: RefObject<HTMLDivElement>,
  callback: () => void
) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (!ref) return;
      if (ref.current && !ref.current.contains(event.target as Node | null)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

const Collections: React.FC = () => {
  //state for storing which dropdown is open, use book id since it's unique
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [addingCollection, setAddingCollection] = useState(false);

  const options = {
    includeScore: true,
    keys: ["title", "author"],
  };

  const { data } = useSession();
  const dropdown = useRef<HTMLDivElement>(null);

  const { data: collections } = api.user_collections.getCollections.useQuery({
    userId: data?.user.id ? data.user.id : "",
  });
  const addBooksToCollection =
    api.user_collections.addBooksToCollection.useMutation({
      onSuccess: () => {
        toast.success("Book added to collection");
      },
    });
  const removeBooksFromCollection =
    api.user_collections.removeBooksFromCollection.useMutation({
      onSuccess: () => {
        toast.success("Book removed from collection");
      },
    });
  const deleteBook = api.user_books.deleteBook.useMutation({
    onSuccess: () => {
      toast.success("Book deleted");
    },
  });

  const handleDropdownSelect = (id: string) => {
    if (selectedDropdown === id) {
      setSelectedDropdown("");
    } else {
      setSelectedDropdown(id);
    }
  };

  useOutsideAlerter(dropdown, () => setSelectedDropdown(""));

  useEffect(() => {
    console.log(collections);
  }, [collections]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <>
      <div className="flex min-h-screen w-full justify-center p-4">
        {/* wrapper */}
        <div className="flex min-h-full w-[70%] flex-col items-center rounded-sm bg-sage-300">
          {/* collections tabs */}
          <div className="flex h-10 w-full divide-x-[1px] divide-sage-600 rounded-sm border-b-[1px] border-sage-900/20 bg-sage-600 px-2 pt-2 text-sage-800">
            {collections
              ? collections.collections.map((collection) => {
                  return (
                    <div
                      key={collection.name}
                      className={
                        `${
                          selectedCollection === collection.name
                            ? "bg-sage-400/60"
                            : ""
                        }` +
                        " button flex h-full w-fit min-w-[6rem] max-w-[10rem] select-none items-center justify-center rounded-sm border-sage-800 bg-sage-400 px-2 text-sm text-sage-900 hover:bg-sage-400/50"
                      }
                      onClick={() => setSelectedCollection(collection.name)}
                    >
                      {collection.name}
                    </div>
                  );
                })
              : null}
            {/* add collections tab */}
            <div className="flex h-full w-fit">
              <input
                className={
                  `${
                    addingCollection
                      ? "mr-[1px] w-32 border-[1px] border-sage-400/80 px-1 outline-none"
                      : "w-0"
                  }` + " h-full bg-sage-200 transition-all"
                }
                type="text"
              />

              <div
                className="button h-18 flex w-8 items-center justify-center rounded-sm bg-sage-300 hover:bg-sage-300/40"
                onClick={() => setAddingCollection(!addingCollection)}
              >
                <PlusIcon className="h-6 w-6 text-sage-800"></PlusIcon>
              </div>
            </div>
          </div>
          {/* search area */}
          <div className="flex h-16 w-full items-center justify-between p-4">
            {/* tags */}
            {/* <div className="h-10 w-52 rounded-sm border border-sage-200/50 bg-sage-100/50 shadow-inner"></div> */}
            {/* placeholder */}
            <div></div>
            <input
              className="h-10 w-96 rounded-sm border border-sage-200/50 bg-sage-100/50 p-2 text-sage-800 shadow-inner outline-none placeholder:text-sage-800/50"
              autoComplete="off"
              placeholder="Search for books"
              onChange={(e) => {
                if (!collections) return;
                const books = collections.collections.find(
                  (collection) => collection.name === selectedCollection
                )?.books;

                if (!books) return;

                const fuse = new Fuse(books, options);
                const result = fuse.search(e.target.value);
                const bookResults = result.map((book) => book.item);
                setSearchResults(bookResults);
              }}
            ></input>
          </div>
          {/* results area */}
          <div className="h-full w-full p-4">
            {collections?.collections.find(
              (collection) => collection.name === selectedCollection
            ) ? (
              <div className="flex h-full max-h-[calc(100vh-12rem)] w-full flex-col divide-y divide-sage-400 overflow-y-scroll rounded-sm bg-sage-300 pl-2">
                {(searchResults.length !== 0
                  ? searchResults
                  : collections?.collections.find(
                      (collection) => collection.name === selectedCollection
                    )!.books
                ).map((book, index) => {
                  return (
                    <BookDisplay
                      key={index}
                      leftSlot={
                        <div className="flex justify-between">
                          <BookDisplay.Image
                            imageUrl={book.coverUrl ? book.coverUrl : ""}
                          />
                          <div className="relative flex h-6 w-36 cursor-pointer select-none text-sm text-sage-800 ">
                            <div
                              className="flex h-full w-full items-center justify-center bg-sage-500/50 active:bg-sage-500/80"
                              onClick={() => handleDropdownSelect(book.id)}
                            >
                              <div className="">Add to Collection</div>
                              <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </div>
                            {selectedDropdown === book.id ? (
                              <div
                                ref={
                                  selectedDropdown === book.id ? dropdown : null
                                }
                                className="absolute top-6 flex h-[8.5rem] w-full flex-col divide-y-[1px] divide-sage-500/80 rounded-b-sm bg-sage-400/50"
                              >
                                {collections
                                  ? collections.collections.map(
                                      (collection) => {
                                        return (
                                          <div
                                            key={collection.name}
                                            className="button flex h-full w-full select-none items-center justify-center rounded-b-sm border-sage-800 px-2 text-sm text-sage-900 hover:bg-sage-400/30 active:bg-sage-400/80"
                                            onClick={() => {
                                              addBooksToCollection.mutate({
                                                bookIds: book.id,
                                                collectionId: collection.id,
                                              });
                                              setSelectedDropdown("");
                                            }}
                                          >
                                            {collection.name}
                                          </div>
                                        );
                                      }
                                    )
                                  : null}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      }
                      middleSlot={
                        <div className="flex h-full flex-col justify-between text-center">
                          <BookDisplay.Title title={book.title} />
                          <BookDisplay.Author author={book.author} />
                        </div>
                      }
                      rightSlot={
                        <div className="flex h-full flex-col items-end justify-between">
                          <div className="flex w-full items-center justify-between">
                            {
                              <TrashIcon
                                className="button h-6 w-6 text-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                onClick={() => {
                                  if (!selectedCollection) return;

                                  if (selectedCollection !== "All") {
                                    const currentCollection =
                                      collections?.collections.find(
                                        (collection) =>
                                          collection.name === selectedCollection
                                      );

                                    if (!currentCollection) return;

                                    removeBooksFromCollection.mutate({
                                      bookIds: book.id,
                                      collectionId: currentCollection.id,
                                    });
                                  } else {
                                    deleteBook.mutate({ bookId: book.id });
                                  }
                                }}
                              ></TrashIcon>
                            }
                            <BookDisplay.Pages
                              pages={book.pages ? book.pages : 0}
                            />
                          </div>
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
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;

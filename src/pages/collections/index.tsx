import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { BookDisplay } from "@/components/BookDisplay/BookDisplay";
import {
  ChevronDownIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import Fuse from "fuse.js";
import type { Book } from "@prisma/client";

import { toast } from "react-toastify";
import {
  useAddBooksToCollection,
  useAddCollection,
  useDeleteBook,
  useDeleteCollection,
  useRemoveBooksFromCollection,
  useUpdateBook,
} from "@/client";
import { Dropdown } from "@/components/Dropdown";

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
  const [expandedBook, setExpandedBook] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [addingCollection, setAddingCollection] = useState(false);
  const [deletingCollection, setDeletingCollection] = useState(false);
  const [sortType, setSortType] = useState<"Time Added" | "Title" | "Release">(
    "Title"
  );
  const [sortState, setSortState] = useState<"Ascending" | "Descending">(
    "Ascending"
  );
  const formRef = useRef<HTMLFormElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);
  const addBooksToCollection = useAddBooksToCollection();
  const removeBooksFromCollection = useRemoveBooksFromCollection();
  const addCollection = useAddCollection();
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();
  const deleteCollection = useDeleteCollection();

  const options = {
    includeScore: true,
    keys: ["title", "author"],
  };

  const { data } = useSession();

  const { data: collections } = api.user_collections.getCollections.useQuery({
    userId: data?.user.id ? data.user.id : "",
  });

  const handleDropdownSelect = (id: string) => {
    if (selectedDropdown === id) {
      setSelectedDropdown("");
    } else {
      setSelectedDropdown(id);
    }
  };

  const handleAddCollection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const collectionName = formData.get("name") as string;

    addCollection.mutate({
      name: collectionName,
    });
    setAddingCollection(false);
    formRef.current?.reset();
  };

  useOutsideAlerter(dropdown, () => setSelectedDropdown(""));

  function sortBooks(
    sortState: string,
    sortType: string
  ): ((a: Book, b: Book) => number) | undefined {
    if (sortState === "Ascending") {
      if (sortType === "Title") {
        return (a, b) =>
          a.title.localeCompare(b.title, "en", { sensitivity: "base" });
      } else if (sortType === "Time Added") {
        return (a, b) => (a.createdAt < b.createdAt ? 1 : -1);
      } else if (sortType === "Release") {
        return (a, b) => {
          if (!a.isbn10 || !b.isbn10) {
            return 1;
          } else {
            return a.isbn10 < b.isbn10 ? 1 : -1;
          }
        };
      }
    } else if (sortState === "Descending") {
      if (sortType === "Title") {
        return (a, b) =>
          b.title.localeCompare(a.title, "en", { sensitivity: "base" });
      } else if (sortType === "Time Added") {
        return (a, b) => (a.createdAt > b.createdAt ? 1 : -1);
      } else if (sortType === "Release") {
        return (a, b) => {
          if (!a.isbn10 || !b.isbn10) {
            return 1;
          } else {
            return a.isbn10 > b.isbn10 ? 1 : -1;
          }
        };
      }
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full justify-center p-4">
        {/* wrapper */}
        <div className="flex min-h-full w-full flex-col items-center rounded-sm bg-sage-300 lg:w-[70%]">
          {/* collections tabs */}
          <div className="group flex h-10 w-full items-center justify-between bg-sage-600">
            <div className="no-scrollbar flex h-full w-full divide-x-[1px] divide-sage-600 overflow-y-hidden overflow-x-scroll rounded-sm border-b-[1px] border-sage-900/20 px-2 pt-2 text-sage-800">
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
                          `${deletingCollection ? "hover:bg-red-400/50" : ""}` +
                          " button flex h-full w-fit min-w-[6rem] shrink-0 select-none items-center justify-center whitespace-nowrap rounded-sm border-sage-800 bg-sage-400 px-2 text-sm text-sage-900 hover:bg-sage-400/50"
                        }
                        onClick={() => {
                          if (deletingCollection) {
                            deleteCollection.mutate({
                              collectionId: collection.id,
                            });
                            setDeletingCollection(false);
                          } else {
                            setSelectedCollection(collection.name);
                            setSelectedDropdown("");
                          }
                        }}
                      >
                        <div className="w-fit">{collection.name}</div>
                      </div>
                    );
                  })
                : null}
              {/* add collections tab */}
              <div className="flex h-full w-fit">
                <form ref={formRef} onSubmit={(e) => handleAddCollection(e)}>
                  <input
                    className={
                      `${
                        addingCollection
                          ? "mr-[1px] w-32 border-[1px] border-sage-400/80 px-1 outline-none"
                          : "w-0"
                      }` +
                      " h-full bg-sage-200 transition-all placeholder:text-sage-800/50"
                    }
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Add Collection"
                  />
                </form>
                <div
                  className="button h-18 flex w-8 items-center justify-center rounded-sm bg-sage-300 hover:bg-sage-300/40"
                  onClick={() => setAddingCollection(!addingCollection)}
                >
                  <PlusIcon className="h-6 w-6 text-sage-800"></PlusIcon>
                </div>
              </div>
            </div>
            {!deletingCollection ? (
              <TrashIcon
                className="button mr-2 h-6 w-6 text-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onClick={() => setDeletingCollection(true)}
              ></TrashIcon>
            ) : (
              <XMarkIcon
                className="button mr-2 h-6 w-6 text-red-500 "
                onClick={() => setDeletingCollection(false)}
              ></XMarkIcon>
            )}
          </div>
          {/* search area */}
          <div className="flex h-16 w-full items-center justify-between gap-1 p-4">
            {/* tags */}
            {/* <div className="h-10 w-52 rounded-sm border border-sage-200/50 bg-sage-100/50 shadow-inner"></div> */}
            {/* sorting */}
            <div className="flex gap-1">
              <div className="min-w-[4rem] rounded-sm bg-sage-400 p-2 text-xs shadow-sm md:text-lg">
                <Dropdown
                  options={["Title", "Time Added", "Release"]}
                  value={sortType}
                  onChange={(e) => {
                    setSortType(e as "Title" | "Time Added" | "Release");
                  }}
                ></Dropdown>
              </div>
              <div className="min-w-[4rem] rounded-sm bg-sage-400 p-2 text-xs shadow-sm md:text-lg">
                <Dropdown
                  options={["Ascending", "Descending"]}
                  icons={
                    new Map([
                      [
                        "Ascending",
                        <ArrowUpIcon
                          className="h-4 w-4 md:h-6 md:w-6"
                          key="Ascending"
                        />,
                      ],
                      [
                        "Descending",
                        <ArrowDownIcon
                          className="h-4 w-4 md:h-6 md:w-6"
                          key="Descending"
                        />,
                      ],
                    ])
                  }
                  value={sortState}
                  onChange={(e) => {
                    setSortState(e as "Ascending" | "Descending");
                  }}
                ></Dropdown>
              </div>
            </div>
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
                )
                  .sort(sortBooks(sortState, sortType))
                  .map((book, index) => {
                    return (
                      <BookDisplay
                        key={index}
                        expanded={expandedBook === book.id}
                        expandable={false}
                        expandDisplay={setExpandedBook}
                        bookId={book.id}
                        leftSlot={
                          <div className="flex h-full justify-between">
                            <div className="h-[12rem] shrink-0">
                              <BookDisplay.Image
                                imageUrl={book.coverUrl ? book.coverUrl : ""}
                              />
                            </div>
                            {/* dropdown */}
                            <div className="flex h-full flex-col justify-between">
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
                                      selectedDropdown === book.id
                                        ? dropdown
                                        : null
                                    }
                                    className="no-scrollbar absolute top-6 z-10 flex h-20 w-full flex-col divide-y-[1px] divide-sage-500/80 overflow-y-scroll rounded-b-sm bg-sage-400/50"
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
                              {/* <BookDisplay.ExpandBookButton
                              setExpanded={setExpandedBook}
                              bookId={book.id}
                              expanded={expandedBook === book.id}
                            ></BookDisplay.ExpandBookButton> */}
                            </div>
                          </div>
                        }
                        middleSlot={
                          <div className="flex h-full shrink-0 flex-col text-center md:justify-between">
                            <BookDisplay.Title title={book.title} />
                            <BookDisplay.Author author={book.author} />
                          </div>
                        }
                        rightSlot={
                          <div className="flex h-full flex-col items-end justify-between">
                            <div className="flex w-full items-center justify-between">
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
                              <div className="flex flex-col justify-end gap-1">
                                <BookDisplay.Pages
                                  pages={book.pages ? book.pages : 0}
                                  bookId={book.id}
                                  readPages={
                                    book.pagesRead ? book.pagesRead : 0
                                  }
                                />
                                <BookDisplay.StarReview
                                  updateBook={updateBook}
                                  bookId={book.id}
                                  initialRating={book.rating ? book.rating : 0}
                                />
                              </div>
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

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
  Cog8ToothIcon,
} from "@heroicons/react/24/solid";
import Fuse from "fuse.js";
import type { GroupBook } from "@prisma/client";

import {
  useAddBookToGroupCollectionByCollectionId,
  useAddCollection,
  useCreateGroupCollection,
  useDeleteBook,
  useDeleteBookFromGroupCollection,
  useDeleteCollection,
  useDeleteGroup,
  useDeleteGroupBook,
  useDeleteGroupCollection,
  useRemoveBooksFromCollection,
  useUpdateBook,
  useUpdateGroup,
  useUpdateGroupBook,
} from "@/client";
import { useRouter } from "next/router";
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

const GroupCollections: React.FC = () => {
  //state for storing which dropdown is open, use book id since it's unique
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const [expandedBook, setExpandedBook] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<GroupBook[]>([]);
  const [addingCollection, setAddingCollection] = useState(false);
  const [deletingCollection, setDeletingCollection] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const addBookToGroupCollectionByCollectionId =
    useAddBookToGroupCollectionByCollectionId();
  const removeBooksFromCollection = useRemoveBooksFromCollection();
  const createGroupCollection = useCreateGroupCollection();
  const deleteBookFromGroupCollection = useDeleteBookFromGroupCollection();
  const deleteGroupBook = useDeleteGroupBook();
  const updateGroupBook = useUpdateGroupBook();
  const deleteGroupCollection = useDeleteGroupCollection();
  const deleteGroup = useDeleteGroup();
  const updateGroup = useUpdateGroup();
  const router = useRouter();

  const options = {
    includeScore: true,
    keys: ["title", "author"],
  };

  const {
    data: group,
    error: groupError,
    isLoading: groupLoading,
  } = api.group.getGroup.useQuery({
    id: router.query.id as string,
  });

  const { data } = useSession();

  useOutsideAlerter(dropdown, () => setSelectedDropdown(""));
  useOutsideAlerter(settingsDropdownRef, () => setSettingsDropdown(false));

  if (groupLoading) return <div>loading</div>;
  if (groupError) return <div>error</div>;
  if (!group) return <div>no group</div>;

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

    createGroupCollection.mutate({
      name: collectionName,
      groupId: group.id,
    });
    setAddingCollection(false);
    formRef.current?.reset();
  };
  return (
    <>
      <div className="relative flex min-h-screen w-full justify-center p-4">
        {/* invite button */}
        <div
          className="button absolute right-2 top-2 rounded-sm bg-sage-500 p-2 px-2 text-sage-800 shadow-sm"
          onClick={() => {
            void navigator.clipboard.writeText(
              `${window.location.origin}/groups/invite/${group.id}`
            );
            toast.success("Invite copied to clipboard");
          }}
        >
          Generate Invite
        </div>
        {/* settings button */}
        <div className="absolute left-2 top-2">
          <Cog8ToothIcon
            className="button h-8 w-8 text-sage-800"
            onClick={() => {
              setSettingsDropdown(!settingsDropdown);
            }}
          ></Cog8ToothIcon>
          {settingsDropdown ? (
            <div
              ref={settingsDropdownRef}
              className="flex w-48 flex-col divide-y divide-sage-800 bg-sage-400 p-1"
            >
              <div
                className="button"
                onClick={() => {
                  deleteGroup.mutate({
                    id: group.id,
                  });
                }}
              >
                Delete Group
              </div>
            </div>
          ) : null}
        </div>
        {/* wrapper */}
        <div className="flex min-h-full w-[70%] flex-col items-center rounded-sm bg-sage-300">
          {/* collections tabs */}
          <div className="group flex h-10 w-full items-center justify-between bg-sage-600">
            <div className="flex h-full w-full divide-x-[1px] divide-sage-600 rounded-sm border-b-[1px] border-sage-900/20 px-2 pt-2 text-sage-800">
              {group
                ? group.groupCollections.map((collection) => {
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
                          " button flex h-full w-fit min-w-[6rem] max-w-[10rem] select-none items-center justify-center rounded-sm border-sage-800 bg-sage-400 px-2 text-sm text-sage-900 hover:bg-sage-400/50"
                        }
                        onClick={() => {
                          if (deletingCollection) {
                            deleteGroupCollection.mutate({
                              id: collection.id,
                            });
                            setDeletingCollection(false);
                          } else {
                            setSelectedCollection(collection.name);
                            setSelectedDropdown("");
                          }
                        }}
                      >
                        {collection.name}
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
                if (!group) return;
                const books = group.groupCollections.find(
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
            {group?.groupCollections.find(
              (collection) => collection.name === selectedCollection
            ) ? (
              <div className="flex h-full max-h-[calc(100vh-12rem)] w-full flex-col divide-y divide-sage-400 overflow-y-scroll rounded-sm bg-sage-300 pl-2">
                {(searchResults.length !== 0
                  ? searchResults
                  : group?.groupCollections.find(
                      (collection) => collection.name === selectedCollection
                    )!.books
                ).map((book, index) => {
                  return (
                    <BookDisplay
                      key={index}
                      expanded={expandedBook === book.id}
                      expandable={false}
                      expandDisplay={setExpandedBook}
                      bookId={book.id}
                      leftSlot={
                        <div className="flex h-full justify-between">
                          <div className="h-[12rem]">
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
                                  className="absolute top-6 flex h-[8.5rem] w-full flex-col divide-y-[1px] divide-sage-500/80 rounded-b-sm bg-sage-400/50"
                                >
                                  {group
                                    ? group.groupCollections.map(
                                        (collection) => {
                                          return (
                                            <div
                                              key={collection.name}
                                              className="button flex h-full w-full select-none items-center justify-center rounded-b-sm border-sage-800 px-2 text-sm text-sage-900 hover:bg-sage-400/30 active:bg-sage-400/80"
                                              onClick={() => {
                                                addBookToGroupCollectionByCollectionId.mutate(
                                                  {
                                                    bookId: book.id,
                                                    collectionId: collection.id,
                                                  }
                                                );
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
                        <div className="flex h-full flex-col justify-between text-center">
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
                                    group?.groupCollections.find(
                                      (collection) =>
                                        collection.name === selectedCollection
                                    );

                                  if (!currentCollection) return;

                                  deleteBookFromGroupCollection.mutate({
                                    bookId: book.id,
                                    collectionId: currentCollection.id,
                                  });
                                } else {
                                  deleteGroupBook.mutate({ id: book.id });
                                }
                              }}
                            ></TrashIcon>
                            <div className="flex flex-col justify-end gap-1">
                              <BookDisplay.GroupPages
                                pages={book.pages ? book.pages : 0}
                                bookId={book.id}
                                readPages={book.pagesRead ? book.pagesRead : 0}
                              />
                              <BookDisplay.StarReview
                                updateBook={updateGroupBook}
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

export default GroupCollections;

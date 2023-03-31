import type { Book } from "@/client";
import type { UseTRPCMutationResult } from "@trpc/react-query/shared";
import Image from "next/image";
import { LegacyRef, ReactNode, useEffect, useRef, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

interface BookDisplayProps {
  leftSlot?: ReactNode;
  middleSlot?: ReactNode;
  rightSlot?: ReactNode;
  expanded?: boolean;
  expandable?: boolean;
  expandDisplay?: React.Dispatch<React.SetStateAction<string>>;
  bookId?: string;
}

interface BookDisplayComponents {
  Image: React.FC<{ imageUrl: string }>;
  Title: React.FC<{ title: string }>;
  Author: React.FC<{ author: string }>;
  Pages: React.FC<{ pages: number; bookId: string; readPages?: number }>;
  ISBN10: React.FC<{ isbn10: string }>;
  ISBN13: React.FC<{ isbn13: string }>;
  AddBookButton: React.FC<{
    addBook: UseTRPCMutationResult<any, any, any, any>;
    book: Book;
    defaultCollectionId: string | undefined;
  }>;
  ExpandBookButton: React.FC<{
    setExpanded: React.Dispatch<React.SetStateAction<string>>;
    bookId: string;
    expanded: boolean;
  }>;
  StarReview: React.FC<{
    bookId: string;
    updateBook: UseTRPCMutationResult<any, any, any, any>;
    initialRating: number;
  }>;
}

export const BookDisplay: React.FC<BookDisplayProps> &
  BookDisplayComponents = ({
  leftSlot,
  middleSlot,
  rightSlot,
  expanded,
  expandable,
  expandDisplay,
  bookId,
}) => {
  useEffect(() => {
    console.log("expanded", expanded);
  }, [expanded]);
  return (
    <div
      className={`group flex w-full ${
        expanded ? "h-[24rem]" : "h-[12rem]"
      } shrink-0 justify-between rounded-sm bg-sage-200 text-sage-800 transition-all`}
      onClick={() => {
        if (!expandable) return;
        if (expanded) {
          expandDisplay?.("");
        }
        if (!expanded && bookId) {
          expandDisplay?.(bookId);
        }
      }}
    >
      <div
        className={`group flex h-[12rem] w-full shrink-0 justify-between rounded-sm bg-sage-200 p-4 text-sage-800 transition-all`}
      >
        {/* left */}
        <div className="grow basis-[33%]">{leftSlot}</div>
        {/* middle */}
        <div className="grow basis-[33%]">{middleSlot}</div>
        {/* right */}
        <div className="grow basis-[33%]">{rightSlot}</div>
      </div>
    </div>
  );
};

const BookDisplayImage: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  return (
    <>
      <Image src={imageUrl} alt="Cover Image" width={100} height={150} />
    </>
  );
};

const BookDisplayTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <>
      <div className="text-lg underline">{title}</div>
    </>
  );
};

const BookDisplayAuthor: React.FC<{ author: string }> = ({ author }) => {
  return (
    <>
      <div className="text-md text-sage-800/50">{author}</div>
    </>
  );
};

const BookDisplayPages: React.FC<{
  pages: number;
  bookId: string;
  readPages?: number;
}> = ({ pages, bookId, readPages }) => {
  const inputRef = useRef<LegacyRef<HTMLInputElement>>(null);
  const [inputValue, setInputValue] = useState<number>(readPages || 0);
  const [dirty, setDirty] = useState<boolean>(false);
  const addReadPagesEvent = api.events.addPagesReadEvent.useMutation();
  const updateBook = api.user_books.updatePagesRead.useMutation({
    onSuccess: (data, variables) => {
      setDirty(false);
      toast.success("Updated read pages for book");
      addReadPagesEvent.mutate({
        bookId: variables.bookId,
        pagesRead: inputValue - (readPages || 0),
      });
    },
    onError: () => {
      toast.error("Failed to update read pages for book");
    },
  });

  return (
    <>
      <div
        className="flex items-center justify-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {readPages || readPages === 0 ? (
          <>
            {dirty ? (
              <>
                <CheckIcon
                  className="h-4 w-4 text-green-800"
                  onClick={() => {
                    updateBook.mutate({
                      bookId: bookId,
                      pagesRead: inputValue,
                      prevPages: readPages,
                    });
                  }}
                ></CheckIcon>
                <XMarkIcon
                  className="h-4 w-4 text-red-800"
                  onClick={() => {
                    setInputValue(readPages || 0);
                    (inputRef.current as unknown as HTMLInputElement).value =
                      readPages.toFixed(0) || "0";
                    setDirty(false);
                  }}
                ></XMarkIcon>
              </>
            ) : null}
            <input
              className="z-60 w-10 bg-sage-200 pl-1 text-right text-sage-800"
              type="number"
              placeholder={"0"}
              defaultValue={readPages}
              onClick={() => {
                (inputRef.current as unknown as HTMLInputElement).select();
              }}
              ref={inputRef as LegacyRef<HTMLInputElement>}
              onChange={(e) => {
                setInputValue(parseInt(e.target.value));
                setDirty(true);
              }}
            ></input>
            <span className="text-sage-800">/</span>
          </>
        ) : null}
        <span>{pages}</span> <span className="text-sage-800/70">Pages</span>
      </div>
    </>
  );
};

const BookDisplayISBN10: React.FC<{ isbn10: string }> = ({ isbn10 }) => {
  return (
    <>
      <div>
        {isbn10 ? isbn10 : "No ISBN 10"}
        <span className="select-none text-sage-800/70"> ISBN 10</span>
      </div>
    </>
  );
};

const BookDisplayISBN13: React.FC<{ isbn13: string }> = ({ isbn13 }) => {
  return (
    <>
      {" "}
      <div>
        {isbn13 ? isbn13 : "No ISBN 13"}
        <span className="select-none text-sage-800/70"> ISBN 13</span>
      </div>
    </>
  );
};

const BookDisplayAddButton: React.FC<{
  addBook: UseTRPCMutationResult<any, any, any, any>;
  book: Book;
  defaultCollectionId: string | undefined;
}> = ({ addBook, book, defaultCollectionId }) => {
  return (
    <>
      <button
        className="rounded-sm bg-sage-800 p-1 text-sm text-sage-200"
        onClick={(e) => {
          addBook.mutate({
            book: book,
            collectionId: defaultCollectionId,
          });
          e.stopPropagation();
        }}
      >
        Add Book
      </button>
    </>
  );
};

const BookDisplayExpandBookButton: React.FC<{
  setExpanded: React.Dispatch<React.SetStateAction<string>>;
  bookId: string;
  expanded: boolean;
}> = ({ setExpanded, bookId, expanded }) => {
  return (
    <>
      <div
        className={`button flex h-4 w-fit ${
          expanded ? "opacity-100" : "opacity-100"
        } flex items-center justify-center text-sage-800 transition-opacity duration-300 group-hover:opacity-100`}
        onClick={() => {
          console.log("expand ", bookId);
          setExpanded(expanded ? "" : bookId);
        }}
      >
        {!expanded ? (
          <ArrowDownIcon
            className={`button flex h-4 w-4 grow text-sage-800`}
          ></ArrowDownIcon>
        ) : (
          <ArrowUpIcon
            className={`button flex h-4 w-4 grow text-sage-800`}
          ></ArrowUpIcon>
        )}
        <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          review
        </span>
      </div>
    </>
  );
};

const BookDisplayStarReview: React.FC<{
  updateBook: UseTRPCMutationResult<any, any, any, any>;
  bookId: string;
  initialRating: number;
}> = ({ updateBook, bookId, initialRating }) => {
  const maxRating = 5;
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <>
      <div
        className="flex justify-end"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {Array.from(Array(maxRating).keys()).map((i) => {
          return (
            <div
              key={i}
              onMouseEnter={() => {
                setHoverRating(i + 1);
              }}
              onMouseLeave={() => {
                setHoverRating(0);
              }}
              onClick={() => {
                setRating(i + 1);
                updateBook.mutate({
                  bookId: bookId,
                  data: { rating: i + 1 },
                });
              }}
              className="button h-4 w-4"
            >
              {i < rating ? (
                <StarIcon />
              ) : i < hoverRating ? (
                <StarIcon />
              ) : (
                <StarOutlineIcon />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

BookDisplay.Image = BookDisplayImage;
BookDisplay.Author = BookDisplayAuthor;
BookDisplay.Title = BookDisplayTitle;
BookDisplay.Pages = BookDisplayPages;
BookDisplay.ISBN10 = BookDisplayISBN10;
BookDisplay.ISBN13 = BookDisplayISBN13;
BookDisplay.AddBookButton = BookDisplayAddButton;
BookDisplay.ExpandBookButton = BookDisplayExpandBookButton;
BookDisplay.StarReview = BookDisplayStarReview;

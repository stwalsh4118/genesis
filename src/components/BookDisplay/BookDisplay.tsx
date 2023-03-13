import type { Book } from "@/client";
import type { UseTRPCMutationResult } from "@trpc/react-query/shared";
import Image from "next/image";
import { ReactNode } from "react";

interface BookDisplayProps {
  leftSlot?: ReactNode;
  middleSlot?: ReactNode;
  rightSlot?: ReactNode;
}

interface BookDisplayComponents {
  Image: React.FC<{ imageUrl: string }>;
  Title: React.FC<{ title: string }>;
  Author: React.FC<{ author: string }>;
  Pages: React.FC<{ pages: number }>;
  ISBN10: React.FC<{ isbn10: string }>;
  ISBN13: React.FC<{ isbn13: string }>;
  AddBookButton: React.FC<{
    addBook: UseTRPCMutationResult<any, any, any, any>;
    book: Book;
  }>;
}

export const BookDisplay: React.FC<BookDisplayProps> &
  BookDisplayComponents = ({ leftSlot, middleSlot, rightSlot }) => {
  return (
    <div className="flex h-[12rem] w-full justify-between rounded-sm bg-sage-200 p-4 text-sage-800">
      {/* left */}
      <div className="grow basis-[33%]">{leftSlot}</div>
      {/* middle */}
      <div className="grow basis-[33%]">{middleSlot}</div>
      {/* right */}
      <div className="grow basis-[33%]">{rightSlot}</div>
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

const BookDisplayPages: React.FC<{ pages: number }> = ({ pages }) => {
  return (
    <>
      <div>
        {pages} <span className="text-sage-800/70">Pages</span>
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
}> = ({ addBook, book }) => {
  return (
    <>
      <button
        className="rounded-sm bg-sage-800 p-1 text-sm text-sage-200"
        onClick={() => {
          addBook.mutate(book);
        }}
      >
        Add Book
      </button>
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

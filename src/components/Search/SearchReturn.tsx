import type { Book } from "@/client";
import Image from "next/image";

interface SearchReturnProps {
  book: Book;
}

export const SearchReturn: React.FC<SearchReturnProps> = ({ book }) => {
  return (
    <div className="flex w-full justify-between rounded-sm bg-sage-200 p-4 text-sage-800">
      {/* left */}
      <div className="grow basis-[33%]">
        <Image
          src={book.cover.large}
          alt="book cover"
          height="100"
          width="60"
        ></Image>
      </div>
      {/* middle */}
      <div className="flex grow basis-[33%] flex-col items-center justify-between">
        <div className="text-lg underline">{book.title}</div>
        <div className="text-md text-sage-800/50">{book.authors[0]?.name}</div>
      </div>
      {/* right */}
      <div className="flex grow basis-[33%] flex-col justify-between text-right text-xs text-sage-800/50">
        <div className="">
          {book.number_of_pages} <span className="text-sage-800/70">Pages</span>
        </div>
        <div className="flex flex-col">
          <div>
            {book.identifiers.isbn_10}
            <span className="select-none text-sage-800/70"> ISBN 10</span>
          </div>
          <div>
            {book.identifiers.isbn_13}
            <span className="select-none text-sage-800/70"> ISBN 13</span>
          </div>
        </div>
      </div>
    </div>
  );
};

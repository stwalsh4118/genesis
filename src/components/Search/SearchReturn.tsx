import type { Book } from "@/client";
import type { UseTRPCMutationResult } from "@trpc/react-query/shared";
import Image from "next/image";

interface SearchReturnProps {
  book: Book;
  onBookAdd: UseTRPCMutationResult<any, any, any, any>;
}

export const SearchReturn: React.FC<SearchReturnProps> = ({
  book,
  onBookAdd,
}) => {
  return (
    <div className="flex w-full justify-between rounded-sm bg-sage-200 p-4 text-sage-800">
      {/* left */}
      <div className="grow basis-[33%]">
        <Image
          src={book.coverUrl}
          alt="book cover"
          height="100"
          width="60"
        ></Image>
      </div>
      {/* middle */}
      <div className="flex grow basis-[33%] flex-col items-center justify-between">
        <div className="relative flex text-lg">
          <div className="text-lg underline">{book.title}</div>
          <span
            className="absolute right-[-20px] hover:cursor-pointer"
            onClick={() => {
              console.log(book);
              onBookAdd.mutate(book);
            }}
          >
            +
          </span>
        </div>
        <div className="text-md text-sage-800/50">{book.author}</div>
      </div>
      {/* right */}
      <div className="flex grow basis-[33%] flex-col justify-between text-right text-xs text-sage-800/50">
        <div className="">
          {book.pages} <span className="text-sage-800/70">Pages</span>
        </div>
        <div className="flex flex-col">
          <div>
            {book.isbn10 ? book.isbn10 : "No ISBN 10"}
            <span className="select-none text-sage-800/70"> ISBN 10</span>
          </div>
          <div>
            {book.isbn13 ? book.isbn13 : "No ISBN 13"}
            <span className="select-none text-sage-800/70"> ISBN 13</span>
          </div>
        </div>
      </div>
    </div>
  );
};

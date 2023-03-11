import type { Book, BookDoc } from "@/client";
import Image from "next/image";

interface SearchReturnProps {
  book: Book | BookDoc;
}

export const SearchReturn: React.FC<SearchReturnProps> = ({ book }) => {
  return (
    <div className="flex w-full justify-between rounded-sm bg-sage-200 p-4 text-sage-800">
      {/* left */}
      <div className="grow basis-[33%]">
        <Image
          src={
            "cover" in book
              ? book.cover.large
              : `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          }
          alt="book cover"
          height="100"
          width="60"
        ></Image>
      </div>
      {/* middle */}
      <div className="flex grow basis-[33%] flex-col items-center justify-between">
        <div className="text-lg underline">{book.title}</div>
        <div className="text-md text-sage-800/50">
          {"authors" in book
            ? book.authors[0]?.name
            : book.author_name
            ? book.author_name[0]
            : "No Author"}
        </div>
      </div>
      {/* right */}
      <div className="flex grow basis-[33%] flex-col justify-between text-right text-xs text-sage-800/50">
        <div className="">
          {"number_of_pages" in book
            ? book.number_of_pages
            : book.number_of_pages_median
            ? book.number_of_pages_median
            : "Unknown"}{" "}
          <span className="text-sage-800/70">Pages</span>
        </div>
        <div className="flex flex-col">
          <div>
            {"identifiers" in book
              ? book.identifiers.isbn_10
              : book.isbn
              ? book.isbn.find((isbn) => isbn.length === 10)
              : "No ISBN 10"}
            <span className="select-none text-sage-800/70"> ISBN 10</span>
          </div>
          <div>
            {"identifiers" in book
              ? book.identifiers.isbn_13
              : book.isbn
              ? book.isbn.find((isbn) => isbn.length === 13)
              : "No ISBN 13"}
            <span className="select-none text-sage-800/70"> ISBN 13</span>
          </div>
        </div>
      </div>
    </div>
  );
};

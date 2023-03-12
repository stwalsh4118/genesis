import { getBookByIsbn, getBookByTitle } from "@/client";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "@/utils/api";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchReturn } from "@/components/Search/SearchReturn";

const Search: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState("");
  const [searchType, setSearchType] = useState<"isbn" | "title">("isbn");
  const query = useQueries({
    queries: [
      {
        queryKey: ["isbn", formData],
        queryFn: () => getBookByIsbn(formData),
        enabled: searchType === "isbn",
      },
      {
        queryKey: ["title", formData],
        queryFn: () => getBookByTitle(formData),
        enabled: searchType === "title",
      },
    ],
  });
  const addBook = api.user_books.addBook.useMutation();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("search"));
    setFormData(formData.get("search") as string);
    await queryClient.invalidateQueries([searchType, formData.get("search")]);
  };

  useEffect(() => {
    query.forEach((query) => {
      if (query.data) {
        console.log(query.data);
      }
    });
  }, [query]);

  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <div
          onClick={() => {
            setSearchType(searchType === "isbn" ? "title" : "isbn");
          }}
        >
          Switch
        </div>
        {/* search wrapper */}
        <div className="flex h-full w-[70%] flex-col">
          {/* search bar */}
          <div className="relative w-full">
            {!query?.every((query) => query.isFetching) &&
            !query?.every((query) => query.isLoading) ? (
              <MagnifyingGlassIcon className="absolute right-4 my-7 h-8 w-8 text-sage-700"></MagnifyingGlassIcon>
            ) : (
              <div className="absolute right-4 my-7 h-8 w-8 animate-spin rounded-full border-b-2 border-sage-700"></div>
            )}
            <form onSubmit={(e) => void handleSearch(e)}>
              <input
                type="search"
                placeholder={`Search by ${searchType}`}
                className="my-4 h-14 w-full rounded-sm bg-sage-300 p-2 text-2xl text-sage-700 outline-none placeholder:text-sage-800/50 focus:outline-sage-600"
                name="search"
                id="search"
                autoComplete="off"
              />
            </form>
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
                            <SearchReturn
                              key={index}
                              book={book}
                              onBookAdd={addBook}
                            ></SearchReturn>
                          );
                        });
                      }
                      return (
                        <SearchReturn
                          key={query.data.title}
                          book={query.data}
                          onBookAdd={addBook}
                        ></SearchReturn>
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

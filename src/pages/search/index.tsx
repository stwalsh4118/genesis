import { Book, getBooks } from "@/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchReturn } from "@/components/Search/SearchReturn";

const Search: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState("");
  const [searchType, setSearchType] = useState<"isbn" | "title">("title");
  const query = useQuery(["search", searchType, formData], () =>
    getBooks(searchType, formData)
  );

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("search"));
    setFormData(formData.get("search") as string);
    await queryClient.invalidateQueries(["search", formData.get("search")]);
  };

  useEffect(() => {
    console.log("searchdata", query.data);
  }, [query.data]);

  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        {/* search wrapper */}
        <div className="flex h-full w-[70%] flex-col">
          {/* search bar */}
          <div className="relative w-full">
            {!query?.isFetching && !query?.isLoading ? (
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
              />
            </form>
          </div>
          {/* search results */}
          <div className="w-full">
            {query && !query.error ? (
              <div className="mb-4 flex max-h-[calc(100vh-8rem)] w-full flex-col divide-y divide-sage-400 overflow-scroll rounded-sm bg-sage-300 p-2">
                {/* search result component */}
                {query.data ? (
                  "docs" in query.data ? (
                    query.data.docs.map((book) => (
                      <SearchReturn key={book.title} book={book}></SearchReturn>
                    ))
                  ) : (
                    <SearchReturn book={query.data}></SearchReturn>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;

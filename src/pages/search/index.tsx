import { getBookByISBN } from "@/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const Search: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState("");
  const query = useQuery({
    queryKey: ["isbn", formData],
    queryFn: () => {
      const data = getBookByISBN(formData).then((res) => console.log(res));
      return data;
    },
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("search"));
    setFormData(formData.get("search") as string);
  };

  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        {/* search wrapper */}
        <div className="relative h-full w-[70%]">
          {/* search bar */}
          <MagnifyingGlassIcon className="absolute right-4 my-7 h-8 w-8 text-sage-700"></MagnifyingGlassIcon>
          <form onSubmit={(e) => handleSearch(e)}>
            <input
              type="search"
              placeholder="Search for books by ISBN"
              className="my-4 h-14 w-full rounded-sm bg-sage-300 p-2 text-2xl text-sage-700 outline-none placeholder:text-sage-800/50 focus:outline-sage-600"
              name="search"
              id="search"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Search;

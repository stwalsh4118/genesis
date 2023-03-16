import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { BookDisplay } from "@/components/BookDisplay/BookDisplay";

const Collections: React.FC = () => {
  const { data, status } = useSession();
  const { data: books } = api.user_books.getBooks.useQuery({
    userId: data?.user.id ? data.user.id : "",
  });
  const { data: collections } = api.user_collections.getCollections.useQuery({
    userId: data?.user.id ? data.user.id : "",
  });
  const addCollection = api.user_collections.addCollection.useMutation();

  const setDefaultCollections = () => {
    collections
      ? addCollection.mutate({
          name: collections.collections
            .filter((collection) =>
              [
                "All",
                "Favorite",
                "Read",
                "Currently Reading",
                "Want to Read",
              ].includes(collection.name)
            )
            .map((collection) => collection.name),
        })
      : null;
  };

  useEffect(() => {
    console.log(books);
  }, [books]);

  useEffect(() => {
    console.log(collections);
  }, [collections]);

  return (
    <>
      <div className="flex min-h-screen w-full justify-center p-4">
        {/* wrapper */}
        <div className="flex min-h-full w-[70%] flex-col items-center rounded-sm bg-sage-300">
          {/* collections tabs */}
          <div className="flex h-10 w-full divide-x-[1px] divide-sage-600 rounded-sm border-b-[1px] border-sage-900/20 bg-sage-600 px-2 pt-2 text-sage-800">
            {collections
              ? collections.collections.map((collection) => {
                  return (
                    <div
                      key={collection.name}
                      className="button flex h-full w-fit min-w-[6rem] select-none items-center justify-center rounded-sm border-sage-800 bg-sage-400 px-2 text-sm text-sage-900 hover:bg-sage-400/50"
                    >
                      {collection.name}
                    </div>
                  );
                })
              : null}
          </div>
          {/* search area */}
          <div className="flex h-16 w-full items-center justify-between p-4">
            <div className="h-10 w-52 rounded-sm border border-sage-200/50 bg-sage-100/50 shadow-inner"></div>
            <input
              className="h-10 w-96 rounded-sm border border-sage-200/50 bg-sage-100/50 p-2 text-sage-800 shadow-inner outline-none placeholder:text-sage-800/50"
              autoComplete="off"
              placeholder="Search for books"
            ></input>
          </div>
          {/* results area */}
          <div className="h-full w-full p-4">
            {books ? (
              <div className="flex h-full max-h-[calc(100vh-12rem)] w-full flex-col divide-y divide-sage-400 overflow-y-scroll rounded-sm bg-sage-300 pl-2">
                {books.books.map((book, index) => {
                  return (
                    <BookDisplay
                      key={index}
                      leftSlot={
                        <BookDisplay.Image
                          imageUrl={book.coverUrl ? book.coverUrl : ""}
                        />
                      }
                      middleSlot={
                        <div className="flex h-full flex-col justify-between text-center">
                          <BookDisplay.Title title={book.title} />
                          <BookDisplay.Author author={book.author} />
                        </div>
                      }
                      rightSlot={
                        <div className="flex h-full flex-col items-end justify-between">
                          <BookDisplay.Pages
                            pages={book.pages ? book.pages : 0}
                          />
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

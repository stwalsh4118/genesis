import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const Collections: React.FC = () => {
  const { data, status } = useSession();
  const { data: books } = api.user_books.getAllBooks.useQuery({
    userId: data?.user.id ? data.user.id : "",
  });

  useEffect(() => {
    console.log(books);
  }, [books]);

  return (
    <>
      <div></div>
      <BookOpenIcon className="h-8 w-8" />
    </>
  );
};

export default Collections;

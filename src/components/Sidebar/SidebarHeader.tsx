import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState } from "react";

export const SidebarHeader: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  setTimeout(() => {
    setLoaded(true);
  }, 50);

  return (
    <div
      className={`flex w-full justify-between transition-opacity duration-1000 ${
        !loaded ? "opacity-0" : ""
      }`}
    >
      <BookOpenIcon className="h-8 w-8" />
      <div className="w-full text-center text-2xl text-sage-800">
        {router.asPath.split("/")[1]!.charAt(0).toUpperCase() +
          router.asPath.split("/")[1]!.slice(1)}
      </div>
      <div className="h-8 w-8"></div>
    </div>
  );
};

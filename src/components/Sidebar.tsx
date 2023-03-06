import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const Sidebar: React.FC = () => {
  const { data: session } = useSession();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 100);
  }, []);

  return (
    <>
      {" "}
      <div className="flex h-full w-full flex-col items-center justify-between pb-8">
        <div
          className={`duration w-full p-4 text-2xl text-sage-800 transition-opacity duration-500 ${
            load ? "opacity-100" : "opacity-0"
          }`}
        >
          MyBrary
        </div>
        <button
          className="rounded-lg bg-sage-700 p-4 text-sage-100"
          onClick={session ? () => void signOut() : () => void signIn()}
        >
          {session ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </>
  );
};

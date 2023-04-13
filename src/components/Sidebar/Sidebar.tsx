import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SidebarHeader } from "./SidebarHeader";

interface SidebarProps {
  loaded: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ loaded }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      <div className="flex h-full max-h-screen w-full flex-col items-center justify-between pb-8">
        <div
          className={`flex h-full w-full flex-col items-center divide-y text-sage-800 transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex w-full p-2">
            <div
              className={`${
                router.asPath === "/dashboard" ? "translate-x-[4.55rem]" : ""
              } w-fit transition-transform duration-300`}
            >
              {router.asPath === "/dashboard" ? (
                <div className="text-2xl text-sage-800">MyBrary</div>
              ) : (
                <>
                  <SidebarHeader></SidebarHeader>
                </>
              )}
            </div>
          </div>
          <div className="mx-2 flex flex-col gap-2 self-stretch p-4 text-center">
            <div
              className="cursor-pointer hover:bg-sage-400"
              onClick={() => void router.push("/dashboard")}
            >
              Dashboard
            </div>
            <div
              className="cursor-pointer hover:bg-sage-400"
              onClick={() => void router.push("/search")}
            >
              Book Search
            </div>
            <div
              className="cursor-pointer hover:bg-sage-400"
              onClick={() => void router.push("/collections")}
            >
              Collections
            </div>
            <div
              className="cursor-pointer hover:bg-sage-400"
              onClick={() => void router.push("/groups")}
            >
              Groups
            </div>
          </div>
          <div className="mx-2 flex flex-col gap-2 self-stretch p-4 text-center">
            <div className="cursor-pointer hover:bg-sage-400">
              Pinned Collections
            </div>
            <div className="cursor-pointer hover:bg-sage-400">Book Search</div>
            <div className="cursor-pointer hover:bg-sage-400">Collections</div>
          </div>
        </div>
        <button
          className="rounded-lg bg-sage-700 p-4 text-sage-100"
          onClick={
            status !== "unauthenticated"
              ? () => void signOut()
              : () => void signIn()
          }
        >
          {session ? "Sign Out" : "Sign In"}
        </button>
        {session?.user.email}
      </div>
    </>
  );
};

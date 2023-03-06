import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
  loaded: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ loaded }) => {
  const { data: session } = useSession();
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-between pb-8">
        <div
          className={`flex w-full flex-col  transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className={`w-full p-4 text-2xl text-sage-800`}>MyBrary</div>
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

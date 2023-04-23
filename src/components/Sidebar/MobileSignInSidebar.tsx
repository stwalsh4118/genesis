import { useSession, signOut, signIn } from "next-auth/react";

export const MobileSignInSidebar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className="relative flex h-full w-full flex-col items-center justify-center py-8">
        <div className="text-4xl text-sage-800">MyBrary</div>
        <button
          className="absolute right-4 rounded-lg bg-sage-700 p-4 text-sage-100"
          onClick={session ? () => void signOut() : () => void signIn()}
        >
          {session ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </>
  );
};

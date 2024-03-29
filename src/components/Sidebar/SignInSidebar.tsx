import { signIn, signOut, useSession } from "next-auth/react";

export const SignInSidebar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      {/* sign in form */}
      <div className="flex h-full w-full flex-col items-center justify-between py-8">
        <div className="text-4xl text-sage-800">MyBrary</div>
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

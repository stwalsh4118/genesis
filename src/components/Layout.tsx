import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>MyBrary</title>
        <meta name="description" content="Website for all your books!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-1 flex-col items-center justify-between py-8">
        {/* sign in form */}
        <div className="text-4xl text-sage-800">MyBrary</div>
        <button
          className="rounded-lg bg-sage-700 p-4 text-sage-100"
          onClick={session ? () => void signOut() : () => void signIn()}
        >
          {session ? "Sign Out" : "Sign In"}
        </button>
      </div>
      {children}
    </>
  );
};

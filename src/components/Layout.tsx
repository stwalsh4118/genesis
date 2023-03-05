import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const redirectToHome = async () => {
    if (!session) {
      await router.push("/");
    }
  };

  useEffect(() => {
    console.log(session);
    session ? void null : void redirectToHome();
  }, [session]);

  return (
    <>
      <Head>
        <title>MyBrary</title>
        <meta name="description" content="Website for all your books!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen w-full bg-sage-100">
        <div className="flex w-[30%] min-w-[20rem] flex-col items-center justify-between bg-sage-300 py-8">
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
      </div>
    </>
  );
};

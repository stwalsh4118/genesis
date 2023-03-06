import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SignInSidebar } from "./auth/SignInSidebar";
import { Sidebar } from "./Sidebar";

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
        <div
          className={`flex w-[30%] min-w-[20rem] bg-sage-300 transition-["width"] duration-500  ${
            session ? "w-[20rem]" : "w-[30%]"
          }`}
        >
          {session ? <Sidebar></Sidebar> : <SignInSidebar></SignInSidebar>}
        </div>

        {children}
      </div>
    </>
  );
};

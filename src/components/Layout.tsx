import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SignInSidebar } from "./auth/SignInSidebar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const redirectToHome = async () => {
    if (status === "unauthenticated") {
      await router.push("/");
    }
  };

  useEffect(() => {
    console.log(session);
    session ? void null : void redirectToHome();
    console.log(status);
    setInterval(() => {
      setLoaded(true);
      // console.log("loaded");
    }, 100);
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
          className={`flex min-w-[10rem] border-r border-sage-700 bg-sage-300 transition-["width"] duration-500  ${
            loaded && status === "authenticated" ? "w-[16rem]" : "w-[30%]"
          }`}
        >
          {status !== "unauthenticated" ? (
            <Sidebar loaded={loaded}></Sidebar>
          ) : (
            <SignInSidebar></SignInSidebar>
          )}
        </div>

        {children}
      </div>
    </>
  );
};

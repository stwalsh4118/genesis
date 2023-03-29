import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SignInSidebar } from "./Sidebar/SignInSidebar";
import { Sidebar } from "./Sidebar/Sidebar";
import { api } from "@/utils/api";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const addCollection = api.user_collections.addCollection.useMutation();

  const setDefaultCollections = () => {
    addCollection.mutate({
      name: ["All", "Favorite", "Read", "Currently Reading", "Want to Read"],
    });
  };

  useEffect(() => {
    console.log("setting default collections");
    setDefaultCollections();
  }, []);

  const redirectToHome = async () => {
    if (status === "unauthenticated") {
      await router.push("/");
    }
  };

  useEffect(() => {
    console.log(session);
    session ? void null : void redirectToHome();
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
      <div className="flex h-screen w-full overflow-hidden bg-sage-100">
        <div
          className={`flex max-h-screen min-w-[10rem] shrink-0 select-none border-r border-sage-700 bg-sage-300 transition-["width"] duration-500 ${
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

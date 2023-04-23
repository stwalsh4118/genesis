import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SignInSidebar } from "./Sidebar/SignInSidebar";
import { Sidebar } from "./Sidebar/Sidebar";
import { api } from "@/utils/api";
import React from "react";
import { MobileSignInSidebar } from "./Sidebar/MobileSignInSidebar";
import { MobileSidebar } from "./Sidebar/MobileSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

function getBreakPoint(windowWidth: number): number {
  console.log("IN BREAKPOINT STUFF", windowWidth);
  if (windowWidth < 720) {
    return 720;
  } else if (windowWidth < 1024) {
    return 1024;
  } else if (windowWidth < 1280) {
    return 1280;
  } else {
    return 1280;
  }
}

export function useWindowSize() {
  const [isWindowClient, setIsWindowClient] = useState(false);
  const [windowSize, setWindowSize] = useState(getBreakPoint(1024));

  useEffect(() => {
    //only execute all the code below in client side
    if (typeof window === "object") {
      setIsWindowClient(true);
      setWindowSize(getBreakPoint(window.innerWidth));
    }
  });

  useEffect(() => {
    //a handler which will be called on change of the screen resize
    function setSize() {
      setWindowSize(getBreakPoint(window.innerWidth));
      console.log("SETTING WINDOW SIZE", getBreakPoint(window.innerWidth));
    }

    if (isWindowClient) {
      //register the window resize listener
      window.addEventListener("resize", setSize);

      //unregister the listerner on destroy of the hook
      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient, setWindowSize]);

  return windowSize;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  // const currentBreakpoint = useBreakpoint([720, 1024, 1280]);
  const windowSize = useWindowSize();

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

  if (windowSize === undefined) {
    return <>hi</>;
  }

  return (
    <>
      <Head>
        <title>MyBrary</title>
        <meta name="description" content="Website for all your books!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-full overflow-hidden bg-sage-100">
        <div className="flex w-full flex-col md:flex-row">
          {/* sidebars */}
          {windowSize > 768 ? (
            <div
              className={`flex max-h-screen w-full min-w-[10rem] shrink-0 select-none border-r border-sage-700 bg-sage-300 transition-["width"] duration-500 ${
                loaded && status === "authenticated"
                  ? "md:w-[16rem]"
                  : "md:w-[30%]"
              }`}
            >
              {status !== "unauthenticated" ? (
                <Sidebar loaded={loaded}></Sidebar>
              ) : (
                <SignInSidebar></SignInSidebar>
              )}
            </div>
          ) : (
            <div className="border-b border-sage-700 bg-sage-300">
              {status !== "unauthenticated" ? (
                <MobileSidebar></MobileSidebar>
              ) : (
                <MobileSignInSidebar></MobileSignInSidebar>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: session } = useSession();
  const router = useRouter();

  const redirectIfSession = async () => {
    if (session) {
      await router.push("/dashboard");
    }
  };

  useEffect(() => {
    console.log(session);
    session ? void redirectIfSession() : void null;
  }, [session]);

  return (
    <>
      <div className="flex min-h-screen bg-sage-100">
        {/* sidebar */}
        <div className="flex w-[30%] min-w-[20rem] flex-col bg-sage-300"></div>
      </div>
    </>
  );
};

export default Home;

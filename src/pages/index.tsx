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

  return <></>;
};

export default Home;

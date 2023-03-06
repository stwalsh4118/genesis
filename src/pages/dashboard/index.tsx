import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    session ? void router.push("/mybrary") : void null;
  }, [session]);

  if (!session) return <></>;

  return <></>;
};

export default Dashboard;

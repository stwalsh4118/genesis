import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session) return <></>;

  return <></>;
};

export default Dashboard;

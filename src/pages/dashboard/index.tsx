import { useSession } from "next-auth/react";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();

  if (!session) return <></>;

  return <></>;
};

export default Dashboard;

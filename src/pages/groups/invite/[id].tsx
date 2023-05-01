import { useAddUserToGroup } from "@/client";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const InvitePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const addUserToGroup = useAddUserToGroup();

  return (
    <>
      <div className="flex h-full w-full items-center justify-center p-8">
        <div
          className="button rounded-sm bg-sage-500 p-2 px-2 text-sage-800 shadow-sm"
          onClick={() => {
            addUserToGroup.mutate({ id: id as string });
          }}
        >
          Accept Invite
        </div>
      </div>
    </>
  );
};

export default InvitePage;

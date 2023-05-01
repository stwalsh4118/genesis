import { useAddUserToGroup } from "@/client";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

const InvitePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const addUserToGroup = useAddUserToGroup();
  const { data: group } = api.group.getGroup.useQuery({ id: id as string });

  useEffect(() => {
    console.log(group);
  }, [group]);

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-10">
        <div className="text-3xl text-sage-800">Welcome to {group?.name}!</div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8">
          <div
            className="button rounded-sm bg-sage-500 p-2 px-2 text-sage-800 shadow-sm"
            onClick={() => {
              addUserToGroup.mutate({ id: id as string });
            }}
          >
            Accept Invite
          </div>
        </div>
      </div>
    </>
  );
};

export default InvitePage;

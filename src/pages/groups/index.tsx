import { api } from "@/utils/api";
import { useRouter } from "next/router";

const GroupsPage: React.FC = () => {
  const router = useRouter();
  const { data: groups } = api.group.getGroups.useQuery();
  const addGroup = api.group.addGroup.useMutation();

  return (
    <>
      <div className="flex h-fit flex-wrap gap-8 p-8">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="relative flex h-96 w-72 flex-col items-center bg-sage-500 p-6"
          >
            <div className="text-2xl font-bold text-sage-800">{group.name}</div>
            <div
              className=" button absolute right-2 top-2 flex h-10 w-10 items-center justify-center bg-sage-600"
              onClick={() =>
                void router.push(`/groups/collections/${group.id}`)
              }
            ></div>
            {/* <div
              className="h-10 w-10 bg-sage-600"
              onClick={() => {
                addGroup.mutate({ name: "test" });
              }}
            ></div> */}
          </div>
        ))}
      </div>
    </>
  );
};

export default GroupsPage;

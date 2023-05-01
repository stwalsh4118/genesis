import { api } from "@/utils/api";
import { useRouter } from "next/router";
//import arrow from heroiconns
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/solid";
import { BookDisplay } from "@/components/BookDisplay/BookDisplay";

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
              className=" button absolute right-2 top-2 flex h-10 w-10 items-center justify-center"
              onClick={() =>
                void router.push(`/groups/collections/${group.id}`)
              }
            >
              <ArrowRightIcon className="h-6 w-6 text-sage-800"></ArrowRightIcon>
            </div>
            <BookDisplay
              leftSlot={
                group.pinnedBook?.coverUrl ? (
                  <BookDisplay.Image
                    imageUrl={group.pinnedBook?.coverUrl ?? ""}
                  ></BookDisplay.Image>
                ) : null
              }
              // middleSlot={}
              // rightSlot={}
            ></BookDisplay>
          </div>
        ))}
        <div className="relative flex h-96 w-72 flex-col items-center justify-center border-4 border-dashed border-sage-800/20 bg-sage-100 p-6">
          <div className="text-2xl font-bold text-sage-300">New Group</div>
          <div
            className=" button absolute right-2 top-2 flex h-10 w-10 items-center justify-center"
            onClick={() => void router.push(`/groups/create`)}
          >
            <PlusIcon className="h-6 w-6 text-sage-800"></PlusIcon>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupsPage;

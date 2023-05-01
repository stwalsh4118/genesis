import { useCreateGroup } from "@/client";
import { FormEvent, useState } from "react";

const CreateGroupPage: React.FC = () => {
  const createGroup = useCreateGroup();

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("search"));
    createGroup.mutate({ name: formData.get("search") as string });
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center gap-10 p-10">
        <div className="text-3xl text-sage-800">Create New Group</div>
        {/* form wrapper */}
        <div className="w-[70%]">
          <form
            className="flex flex-col items-end"
            onSubmit={(e) => void handleCreate(e)}
          >
            <input
              type="search"
              placeholder="Choose Group Name"
              className="my-4 h-14 w-full rounded-sm bg-sage-300 p-2 text-2xl text-sage-700 outline-none placeholder:text-sage-800/50 focus:outline-sage-600"
              name="search"
              id="search"
              autoComplete="off"
            />
            <button className="button w-fit rounded-sm bg-sage-500 p-1 px-2 text-sage-800 shadow-sm">
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateGroupPage;

//import hambuger icon from heroicons
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Dropdown } from "@/components/Dropdown";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const MobileSidebar: React.FC = () => {
  const router = useRouter();
  const [dropdownValue, setDropdownValue] = useState("Dashboard");

  useEffect(() => {
    void router.push(`/${dropdownValue.toLowerCase()}`);
  }, [dropdownValue]);

  return (
    <>
      <div className="relative flex h-full w-full items-center justify-center py-4">
        <div className="text-4xl text-sage-800">MyBrary</div>
        <Bars3Icon className="button absolute left-4 h-8 w-8 text-sage-800"></Bars3Icon>
        <div>
          <Dropdown
            options={["Dashboard", "Book Search", "Collections"]}
            value={dropdownValue}
            onChange={(value) => {
              setDropdownValue(value);
            }}
          ></Dropdown>
        </div>
      </div>
    </>
  );
};

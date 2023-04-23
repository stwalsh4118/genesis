//import hambuger icon from heroicons
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Dropdown } from "@/components/Dropdown";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useOutsideAlerter } from "@/pages/collections";

export const MobileSidebar: React.FC = () => {
  const router = useRouter();
  const [dropdownValue, setDropdownValue] = useState("");
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  useOutsideAlerter(dropdownRef, () => {
    setShowDropdown(false);
  });

  useEffect(() => {
    if (!dropdownValue) return;
    void router.push(`/${dropdownValue.toLowerCase()}`);
  }, [dropdownValue]);

  return (
    <>
      <div className="relative flex h-full w-full items-center justify-center py-4">
        <div className="text-4xl text-sage-800">MyBrary</div>
        <Bars3Icon
          className="button absolute left-4 h-8 w-8 text-sage-800"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        ></Bars3Icon>
        {showDropdown ? (
          <div className="absolute top-[calc(100%)] z-30 flex w-full flex-col items-center justify-center divide-y divide-sage-800 bg-sage-400 text-sage-800">
            {["Dashboard", "Search", "Collections"].map((item) => (
              <div
                className="button w-full p-2 text-center"
                key={item}
                onClick={() => {
                  setDropdownValue(item);
                  setShowDropdown(false);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

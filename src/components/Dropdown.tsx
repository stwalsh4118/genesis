import { useOutsideAlerter } from "@/pages/collections";
import { ReactNode, useRef, useState } from "react";

export type DropdownProps = {
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  valueHidden?: boolean;
  icons?: Map<string, JSX.Element>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  valueHidden,
  icons,
  label,
  placeholder,
  disabled,
}) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  useOutsideAlerter(ref, () => {
    setIsOpen(false);
  });

  return (
    <>
      <div
        ref={ref}
        className="relative h-full w-full min-w-fit"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {valueHidden ? null : (
          <div className="button flex h-full w-full items-center justify-center">
            {icons ? icons.get(value!) : value}
          </div>
        )}
        {isOpen ? (
          <div className="no-scrollbar absolute top-[calc(100%)] -left-2 z-10 w-full min-w-fit overflow-y-scroll bg-sage-500 p-2">
            {options?.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange?.(option);
                  setIsOpen(false);
                }}
                className="button whitespace-nowrap"
              >
                {option}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

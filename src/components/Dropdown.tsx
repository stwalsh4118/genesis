import { useOutsideAlerter } from "@/pages/collections";
import { useRef, useState } from "react";

export type DropdownProps = {
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
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
      <div ref={ref} className="relative h-full w-full">
        <div
          className="button flex h-full w-full items-center justify-center"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {value}
        </div>
        {isOpen ? (
          <div className="absolute top-[calc(100%)] z-10 w-full bg-sage-500">
            {options?.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange?.(option);
                  setIsOpen(false);
                }}
                className="button"
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

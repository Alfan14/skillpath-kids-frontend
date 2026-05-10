import { useState } from "react";

export const Tooltip = ({ text, children }: { text: string, children: React.ReactNode, key?: React.Key }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col items-center group" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full mb-2 flex flex-col items-center group-hover:flex">
          <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-primary shadow-lg rounded-lg font-bold">
            {text}
          </span>
          <div className="w-3 h-3 -mt-2 rotate-45 bg-primary"></div>
        </div>
      )}
    </div>
  );
};
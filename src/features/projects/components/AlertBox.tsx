import type React from "react";

type AlertBoxProps = {
  message: string;
};

export const AlertBox: React.FC<AlertBoxProps> = ({ message }) => {
  return (
    <div
      className=" w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 text-sm font-medium" role="alert" >
      {message}
    </div>
  );
};



import { GripVertical } from "lucide-react";
import React from "react";

type BoxProps = {
  item: number;
};

export default function Box({ item }: BoxProps) {
  return (
    <div className="w-full h-10 bg-gray-200 flex items-center" >
      <div className="box-mover cursor-grab">
        <GripVertical />
      </div>
      <div className="box-text text-gray-800">This is the place for text</div>
    </div>
  );
}

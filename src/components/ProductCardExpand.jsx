import React, { forwardRef } from "react";
import { RxCross1 } from "react-icons/rx";

const ProductCardExpand = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="grid md:grid-cols-2 md:grid-rows-none grid-rows-2 grid-cols-none col-span-full border px-[3%] relative"
    >
      <div className="absolute md:right-[3%] right-[5%] top-[3%] z-[9]">
        <RxCross1
          className="cursor-pointer"
          onClick={props.closeProductCardOnClick}
        />
      </div>
      <div className="flex flex-col justify-between items-center py-[5%]  px-[8%] relative">
        <img
          alt="Item Image"
          className="h-[100%] object-contain"
          src={`https://cws.auckland.ac.nz/gas/api/ItemPhoto/${props.image}`}
        />
        <div className="text-center">{props.item}</div>
        <div>{"$" + props.price}</div>
      </div>
      <div className="flex flex-col gap-[4%] md:py-[5%] pb-0 pt-[5%]">
        <h4 className="font-medium md:text-[1.2rem] text-base">Description</h4>
        <p className="md:text-base text-sm">{props.description}</p>
      </div>
    </div>
  );
});

export default ProductCardExpand;

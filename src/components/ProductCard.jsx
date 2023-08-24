import React, { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

const ProductCard = ({
  id,
  image,
  item,
  description,
  price,
  growProductCardOnClick,
  openProduct,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };
  return (
    <div
      className={`border flex flex-col justify-between items-center py-[5%] px-[8%] relative cursor-pointer bg-white`}
      onClick={() => growProductCardOnClick(id)}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div
        className={` ${
          openProduct === id
            ? "absolute top-0 left-0 h-full w-full flex items-center justify-center bg-slate-800 bg-opacity-70"
            : "hidden"
        }`}
      >
        <p className="text-white">Currently Viewing</p>
      </div>
      {isHovering && openProduct !== id && (
        <div className="absolute top-0 left-0 h-full w-full bg-slate-800 bg-opacity-70 text-center flex items-center  gap-[3%] px-[10%]">
          <p className="text-white whitespace-normal line-clamp-6 overflow-ellipsis">
            {description}
          </p>
        </div>
      )}

      <img
        alt="Item Image"
        className="h-[100%] object-contain"
        src={`https://cws.auckland.ac.nz/gas/api/ItemPhoto/${image}`}
      />
      <div className="text-center">{item}</div>
      <div>{"$" + price}</div>
    </div>
  );
};

export default ProductCard;

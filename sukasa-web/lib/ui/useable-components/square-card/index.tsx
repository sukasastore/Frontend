"use client";

import Image from "next/image";
import React from "react";
// import { ClockSvg, CycleSvg, FaceSvg } from "@/lib/utils/assets/svg";
// import IconWithTitle from "../icon-with-title";
import { ICuisinesCardProps } from "@/lib/utils/interfaces";
import { useRouter } from "next/navigation";

const SquareCard: React.FC<ICuisinesCardProps> = ({
  item,
  cuisines = false,
  showLogo = false,
}) => {
  const router = useRouter();
  const getImgSrc = showLogo ? item?.logo : item?.image;

  const onClickHandler = () => {
    if (!cuisines) {
      router.push(
        `/${item?.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`
      );
    } else {
      router.push(`/category/${item.name.toLowerCase().replace(/\s/g, "-")}`);
    }
  };
  return (
    <div
      className="rounded-md max-w-prose shadow-md m-2 mb-6 cursor-pointer hover:scale-102 hover:opacity-95 hover:shadow-lg transition-transform duration-500 max-h-[272px] w-[96%] ml-[2%] my-[4%]"
      onClick={onClickHandler}
    >
      {/* Image Container */}
      <div className="relative w-full h-[150px]">
        <Image
          src={`${getImgSrc || "https://res.cloudinary.com/do1ia4vzf/image/upload/v1740680733/food/ehmip6g5ddtmkygpw7he.webp"}`}
          alt={item?.name}
          fill
          className="object-cover rounded-t-md"
        />
      </div>

      {/* Content Section */}
      <div className="p-2 flex flex-col justify-between flex-grow">
        <div className="flex flex-row justify-between items-center relative">
          <div className="md:w-[70%]">
            <p className="text-sm lg:text-base text-[#374151] font-semibold line-clamp-1">
              {item?.name}
            </p>
            {cuisines && (
              <p className="text-xs xl:text-sm text-[#4B5563] font-light line-clamp-1">
                {item?.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquareCard;

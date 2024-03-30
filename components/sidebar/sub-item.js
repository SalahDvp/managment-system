"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";


const SubMenuItem = ({ item }) => {
  const { name, path } = item;
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    router.push(path);
  };

  const isActive = useMemo(() => path === pathname, [path, pathname]);


  return (
    <div
      className={`text-sm hover:text-green-300 hover:font-semibold cursor-pointer ${
        isActive ? "text-green-300 font-semibold" : ""
      }`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default SubMenuItem;
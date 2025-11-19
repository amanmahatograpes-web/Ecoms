import React from "react";
import Logo from "../../Images/Packky.svg";

export default function LoadingScreen({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full relative">
      <div className="absolute top-[30%] flex flex-col items-center">
        <div className="relative w-24 h-24 animate-pulse">
          <img src={Logo} alt="Loading" className="w-full h-full object-contain" />
          <div className="absolute inset-0 rounded-full animate-ping bg-orange-500 opacity-10"></div>
        </div>
        <p className="mt-4 text-sm text-gray-600 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
}

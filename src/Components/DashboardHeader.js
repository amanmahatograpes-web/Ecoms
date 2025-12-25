import React from "react";
import Logo from "../assets/g.png"; // change path based on your project

import {
  Search,
  Bell,
  HelpCircle,
  Globe,
  Settings,
  LogOut,
  Mail,
  User,
  Menu
} from "lucide-react";

export default function DashboardHeader({ seller, onMenuClick }) {
  return (
    <header className="w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-40">

      {/* LEFT: Hamburger + Logo + Search */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
        {/* HAMBURGER MENU FOR MOBILE */}
        {/* <button 
          onClick={onMenuClick}
          className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md"
          aria-label="Toggle menu"
        >
          <Menu size={22} className="text-gray-700" />
        </button> */}

        {/* LOGO - ALWAYS VISIBLE */}
       <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#199675] whitespace-nowrap">
 <img
  src={Logo}
  alt="Grapeskart Logo"
  className="object-contain mt-5 p-5"
  style={{ width: "200px", height: "90%" }}
/>

 
</h1>


        {/* SEARCH - Hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1.5 rounded-full w-48 md:w-64 lg:w-80 xl:w-96">
          <Search size={18} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search products, orders, reports..."
            className="bg-transparent outline-none ml-2 w-full text-sm"
          />
        </div>

        {/* NEXT GEN SELLING TAG - Hidden on mobile */}
        <span className="hidden md:inline text-xs bg-[#199675] text-white px-2.5 py-1.5 rounded whitespace-nowrap">
          Next Gen Selling
        </span>
      </div>

      {/* RIGHT: Seller Info + Icons */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-6">

        {/* SEARCH ICON FOR MOBILE */}
        <button className="sm:hidden p-1.5 hover:bg-gray-100 rounded-full">
          <Search size={22} className="text-gray-700" />
        </button>

        {/* ICONS GROUP - Some hidden on mobile */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          {/* GMAIL INBOX */}
          <Mail size={21} className="text-gray-700 cursor-pointer hover:text-[#199675] hover:scale-105 transition-transform" />
          
          {/* SETTINGS */}
          <Settings size={21} className="text-gray-700 cursor-pointer hover:text-[#199675] hover:scale-105 transition-transform" />
          
          {/* LANGUAGE SELECTOR - Hidden on mobile, tablet+ */}
          <div className="hidden md:flex items-center gap-1.5 cursor-pointer">
            <Globe size={19} className="text-gray-700" />
            <select className="text-sm bg-transparent outline-none cursor-pointer">
              <option>EN</option>
              <option>HI</option>
            </select>
          </div>
          
          {/* COUNTRY SELECTOR - Hidden on mobile & tablet, desktop+ */}
          <select className="hidden lg:block text-sm bg-transparent outline-none cursor-pointer px-1 py-0.5 hover:bg-gray-50 rounded">
            <option>India 🇮🇳</option>
            <option>US 🇺🇸</option>
            <option>UK 🇬🇧</option>
          </select>
        </div>

        {/* HELP - Hidden on mobile, visible on tablet+ */}
        <HelpCircle size={21} className="hidden sm:block text-gray-700 cursor-pointer hover:text-[#199675] hover:scale-105 transition-transform" />

        {/* SELLER INFO - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:block text-right min-w-[100px] lg:min-w-[130px]">
          <p className="text-sm font-medium truncate">
            {seller?.name || "Seller Name"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {seller?.company || "Company Name"}
          </p>
        </div>

        {/* PROFILE AVATAR */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
          <User size={20} className="text-gray-600" />
        </div>

        {/* LOGOUT ICON - Hidden on mobile, visible on tablet+ */}
        <LogOut size={21} className="hidden sm:block text-red-500 cursor-pointer hover:text-red-600 hover:scale-105 transition-transform" />

      </div>
    </header>
  );
}
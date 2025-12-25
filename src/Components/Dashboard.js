import React from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

export default function Dashboard({ currentView, setCurrentView, children }) {
  const seller = {
    name: "Aman Mahato",
    company: "Grapeskart Pvt Ltd",
  };

  return (
    <div className="flex w-full h-screen">
      
      {/* LEFT SIDEBAR */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* RIGHT MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP HEADER */}
        <DashboardHeader seller={seller} />

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </div>

      </div>
    </div>
  );
}

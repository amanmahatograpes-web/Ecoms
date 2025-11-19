import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./MainDashboard/Header";
import { Outlet } from "react-router-dom";
import AddTaskModal from "./MainDashboard/AddTaskModal";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const openAddTaskModal = () => setShowAddTaskModal(true);
  const closeAddTaskModal = () => setShowAddTaskModal(false);


  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        {/* <Header onAddTaskClick={openAddTaskModal} /> */}
        <Header onAddTaskClick={openAddTaskModal} />

        {/* Important: render modal here so it overlays Outlet content */}
        <AddTaskModal isOpen={showAddTaskModal} onClose={closeAddTaskModal} />

        <div className="flex-1 bg-gray-50 overflow-y-auto p-2">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

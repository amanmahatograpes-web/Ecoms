import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  ClipboardList,
  MapPin,
  Power,
  ChevronLeft,
  Menu,
  Banknote,
  BarChartBig,
  LucideShoppingCart,
  CalendarClock,
  BadgePercent,
} from "lucide-react";
import { useGlobalContext } from "../GlobalContext";
import ConfirmLogoutModal from "./Utils/./ConfirmLogoutModal";
import Logo from "../Images/Packky.svg";
const iconMap = {
  Dashboard: LayoutDashboard,
  Tasks: ClipboardList,
  Reports: BarChartBig,
  Driver: MapPin,
  Teams: Users,
  Slots: CalendarClock,
  Settings: Settings,
  Banks: Banknote,
  Notifications: Bell,
  Shops: LucideShoppingCart,
  Tiers: BadgePercent,
  Tier: BadgePercent,
  Notification: Bell,
};


const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Tasks", icon: ClipboardList },
  { name: "Reports", icon: BarChartBig },
  { name: "Driver", icon: MapPin },
  { name: "Teams", icon: Users },
  { name: "Slots", icon: CalendarClock },
  { name: "Settings", icon: Settings },
  { name: "Banks", icon: Banknote },
  { name: "Notifications", icon: Bell },
  { name: "Shops", icon: LucideShoppingCart },
  { name: "Tier", icon: BadgePercent },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { baseurl, token, accessToken, setIsUnauthorised } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
  const fetchAccessMenu = async () => {
    try {
      const res = await fetch(`${baseurl}/api/Admin/v1.0/getUserAccess`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: "1" }), // replace with real user ID
      });

      const data = await res.json();
      if (data.responseCode === "00") {
        setMenuItems(data.response.filter(item => item.menu_title && item.menu_url));
      } else if (data.responseCode === "401") {
        setIsUnauthorised(true);
      }
    } catch (err) {
      console.error("Error fetching menu access", err);
    }
  };

  fetchAccessMenu();
}, []);

  return (
    <div
      className={`${
        sidebarOpen ? "w-56" : "w-16"
      } transition-all duration-300 flex flex-col`}
      style={{ backgroundColor: "#FC981B", color: "#ffff", fontWeight: "600" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-lg font-bold whitespace-nowrap">
          {sidebarOpen ? (
            <div
              className="h-15 content-center"
              style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "2rem",
              }}
            >
              <img className="h-7" src={Logo} alt="" />
            </div>
          ) : (
            "P"
          )}
        </span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 py-2 space-y-2">
       {menuItems.map((item) => {
  const routePath = item.menu_url;
  const isActive = location.pathname === routePath;
  const Icon = iconMap[item.menu_title] || LayoutDashboard;

  return (
    <div
      key={item.menu_title}
      onClick={() => navigate(routePath)}
      className={`flex items-center space-x-2 p-2 cursor-pointer transition-all ${
        isActive
          ? "bg-white bg-opacity-20 border-l-4 border-white"
          : "hover:bg-white/20"
      }`}
      style={{ paddingLeft: isActive ? "12px" : "16px" }}
    >
      <Icon size={20} />
      {sidebarOpen && <span>{item.menu_title}</span>}
    </div>
  );
})}
      </div>

      <div className="p-4 border-t border-gray-700">
        <ConfirmLogoutModal
          trigger={
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-red-500 p-2 rounded text-white">
              <Power size={20} />
              {sidebarOpen && <span>Logout</span>}
            </div>
          }
        />
      </div>
    </div>
  );
}

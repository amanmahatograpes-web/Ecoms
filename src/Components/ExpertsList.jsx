import { useState } from "react";
import ExpertCard from "./ExpertCard";
import avatar from "../assets/avatar.png";
import {
  FaFilter,
  FaBars,
  FaSearch,
  FaBell,
  FaCalendarPlus,
  FaHome,
  FaBroadcastTower,
  FaWallet,
  FaUser,
  FaArrowLeft,
  FaUsers,
  FaHeadset,
  FaInfoCircle,
  FaSignOutAlt,
  FaHistory,
  FaGift,
} from "react-icons/fa";

/* ---------------- Dummy Data ---------------- */
const experts = Array(6).fill({
  name: "Riyal Sharma",
  role: "HR Head",
  rating: 4.5,
  price: 40,
  image: avatar,
  description:
    "I am a this and that what you think about this you are so good in this and thank you answer.",
});

/* ---------------- Menu Item ---------------- */
const MenuItem = ({ icon, label }) => (
  <div className="flex items-center gap-4 cursor-pointer hover:text-gray-300">
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </div>
);

/* ---------------- Main Component ---------------- */
const ExpertsList = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 pb-24 relative">
      {/* ================= TOP NAVBAR ================= */}
      <header className="bg-[#1f4b6e] text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <FaBars
            className="text-xl cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />

          <div className="flex-1 max-w-md relative hidden sm:block">
            <input
              type="text"
              placeholder="Talk to Real HRs Today"
              className="w-full pl-10 pr-4 py-2 rounded-full text-black focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <FaCalendarPlus className="text-lg cursor-pointer" />
            <FaBell className="text-lg cursor-pointer" />
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR (ALL DEVICES) ================= */}
      <div
        className={`fixed inset-0 z-50 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-[#1f4b6e] text-white transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 p-4 border-b border-white/20">
            <FaArrowLeft
              className="cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
            <h2 className="text-xl font-semibold">Menu</h2>
          </div>

          <nav className="p-4 space-y-5 text-sm">
            <MenuItem icon={<FaHome />} label="Home" />
            <MenuItem icon={<FaBroadcastTower />} label="HR Connects" />
            <MenuItem icon={<FaUsers />} label="HR Buddy" />
            <MenuItem icon={<FaBroadcastTower />} label="Live" />
            <MenuItem icon={<FaHistory />} label="Order History" />
            <MenuItem icon={<FaWallet />} label="Wallet" />
            <MenuItem icon={<FaInfoCircle />} label="Career News" />
            <MenuItem icon={<FaGift />} label="Refer & Earn Rewards" />
            <MenuItem icon={<FaHeadset />} label="Customer Support" />
            <MenuItem icon={<FaInfoCircle />} label="Contact Us" />
            <MenuItem icon={<FaSignOutAlt />} label="Logout" />
          </nav>
        </aside>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <main
        className={`transition-all duration-300 ${
          menuOpen ? "md:ml-72" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto p-4 space-y-6">
          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl shadow-sm">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
              <FaFilter />
              Filter
            </button>

            <select className="text-sm border rounded-lg px-3 py-2">
              <option>Rate</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>

            <select className="text-sm border rounded-lg px-3 py-2">
              <option>Status</option>
              <option>Available</option>
              <option>Busy</option>
            </select>

            <select className="text-sm border rounded-lg px-3 py-2">
              <option>Position</option>
              <option>HR Head</option>
              <option>Manager</option>
              <option>Recruiter</option>
            </select>
          </div>

          {/* EXPERT LIST */}
          <div className="space-y-4">
            {experts.map((expert, index) => (
              <ExpertCard key={index} expert={expert} />
            ))}
          </div>
        </div>
      </main>

      {/* ================= BOTTOM NAV (MOBILE ONLY) ================= */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="relative mx-auto max-w-md">
          <div className="bg-[#1f4b6e] rounded-t-3xl px-6 py-4 flex justify-between items-center text-white">
            <FaHome className="text-xl cursor-pointer" />
            <FaBroadcastTower className="text-xl cursor-pointer" />

            {/* Center Button */}
            <div className="absolute left-1/2 -top-6 -translate-x-1/2">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <div className="bg-[#1f4b6e] w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  HR
                </div>
              </div>
            </div>

            <FaWallet className="text-xl cursor-pointer" />
            <FaUser className="text-xl cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExpertsList;

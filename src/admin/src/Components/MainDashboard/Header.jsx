import { useLocation } from "react-router-dom";
import { useState ,useEffect } from "react";
import { useGlobalContext } from "../../GlobalContext";
import { Bell, Volume2, Menu, LogOut } from "lucide-react";
import Logo from "../../Images/Packky.svg";
import AddTaskModal from "./AddTaskModal";
import ConfirmLogoutModal from '../Utils/./ConfirmLogoutModal';


export default function Header({ onAddTaskClick }) {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [modalOpen, setModalOpen] = useState(false);
  const { teams, setTeam, searchQuery, setSearchQueryGlobal, selectedTeam, setSelectedTeam ,FetchTeamCall} = useGlobalContext();
  useEffect(() => {
 FetchTeamCall()
  }, [])
  

  return (
    <div className="bg-yellow-50 text-white flex justify-between items-center px-6 py-3 shadow">
      {isDashboard && (
        <div className="flex items-center space-x-4">
          <select
            className="border px-2 py-1 rounded text-black"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="All Team">All Team</option>
            {teams.map((team) => (
              <option key={team.Id} value={team.team_name}>
                {team.team_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search map"
            value={searchQuery}
            onChange={(e) => setSearchQueryGlobal(e.target.value)}
            className="rounded px-2 py-1 text-sm"
          />
        </div>
      )}

      <img src={Logo} alt="Logo" className="h-7" />

      <div className="space-x-4 flex items-center">
        {isDashboard && (
          <button className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm" onClick={onAddTaskClick}>
            Add New Task
          </button>
        )}
        
        <Volume2 size={18} className="text-orange-500 cursor-pointer" />
        <Bell size={18} className="text-orange-500 cursor-pointer" />
        
        <ConfirmLogoutModal
                  trigger={
                 <LogOut size={18} className="text-orange-500 cursor-pointer" />
                  }
                />
        {/* outer Components */}
        {/* <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      /> */}
      </div>
    </div>
  );
}

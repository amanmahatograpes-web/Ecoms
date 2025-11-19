// TeamsPage.jsx
import { useState, useEffect } from "react";
import { Plus, Send, RefreshCcw } from "lucide-react";
import { Toaster, toast } from 'sonner';
import axios from "axios";
import { useGlobalContext } from "../../GlobalContext";
import LoadingScreen from "../Utils/LoadingScreen";




export default function TeamsPage() {
  const { baseurl, token, accessToken, setIsUnauthorised } = useGlobalContext();
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [Loading, setLoading] = useState()
  const [search, setSearch] = useState("");
  const [teamStatusFilter, setTeamStatusFilter] = useState(""); // For dropdown

  const teamsPerPage = 15;

  const indexOfLast = currentPage * teamsPerPage;
  const indexOfFirst = indexOfLast - teamsPerPage;
  const filteredTeams = teams.filter(team =>
    (!teamStatusFilter || team.status === teamStatusFilter) &&
    (search === "" ||
      team.team_name?.toLowerCase().includes(search.toLowerCase()) ||
      team.createdOn?.toLowerCase().includes(search.toLowerCase()))
  );

  const currentTeams = filteredTeams.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);


  // Api Calls ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const FetchTeamCall = async () => {
    setLoading(true);
    try {
      const UserDetail = {
        userid: "9",

      };

      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/getDriverTeamList`,
        UserDetail,

        {
          headers: {
            'Authorization': `Basic ${token}`
          }
        }
      );

      if (response.data.responseCode === "00") {
        // toast.success(response.data.responseMessage);
        setTeams(response.data.data);

      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);

      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error fetching Driver");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchTeamCall();
  }, [])

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Teams</h1>

      </div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        {/* 🔍 Search & Filters (left) */}
        <div className="flex flex-wrap items-end gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team name or date..."
            className="px-2 py-1 border rounded text-xs shadow-sm w-[180px]"
          />
          <select
            value={teamStatusFilter}
            onChange={(e) => setTeamStatusFilter(e.target.value)}
            className="text-xs border rounded px-2 py-1 shadow-sm w-[130px]"
          >
            <option value="">All Status</option>
            <option value="publish">Publish</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* 🔘 Actions (right) */}
        <div className="flex flex-wrap items-end gap-2">
          <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs shadow">
            <Plus size={14} />
            <span>Create Team</span>
          </button>
          <button className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs shadow">
            <Send size={14} />
            <span>Send Bulk</span>
          </button>
          <button
            className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs shadow"
            onClick={FetchTeamCall}
          >
            <RefreshCcw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {Loading ? <LoadingScreen /> : <>
        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-orange-400 text-left text-sm font-semibold text-white">
                <th className="px-4 py-2 text-center">ID</th>
                <th className="px-4 py-2 text-center">Team Name</th>
                <th className="px-4 py-2 text-center">Created On</th>
                <th className="px-4 py-2 text-center">Accuracy</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team) => (
                <tr key={team.id} className="text-sm border-t">
                  <td className="px-4 py-2 text-center">{team.id}</td>
                  <td className="px-4 py-2 font-medium text-center">{team.team_name}</td>
                  <td className="px-4 py-2 text-center">{team.createdOn}</td>
                  <td className="px-4 py-2 text-center">{team.location_accuracy}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${team.status === "publish"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer text-center">
                    Edit
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div></>}

    </div>
  );
}

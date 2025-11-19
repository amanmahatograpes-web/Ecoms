// context/GlobalContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [baseurl] = useState("https://api.packky.com");

  const [accessToken, setAccessToken] = useState(() => {
    const admin = sessionStorage.getItem("admin");
    return admin ? JSON.parse(admin).accessToken : null;
  });
  const [AdminId, setAdminId] =  useState(() => {
    const admin = sessionStorage.getItem("admin");
    return admin ? JSON.parse(admin).userId
 : null;
  });
  useEffect(() => {
   console.log(AdminId)
  }, [AdminId])
  
 

  const [ApiCall, setApiCall] = useState(false);
  const [IsUnauthorised, setIsUnauthorised] = useState(false);
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = sessionStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const username = "packky@gmail.com";
  const password = "Z90LTO34RTNQGT49LCIYRVTXJERZTKX8";
  const token = btoa(`${username}:${password}`);

  const [team, setTeam] = useState("All Team");
  const [searchQueryGlobal, setSearchQueryGlobal] = useState("");

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("All Team");

  const [socketData, setSocketData] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeout = useRef(null);

  // 🔄 Auto-Reconnecting WebSocket
  useEffect(() => {
    if (!admin?.userId) return;

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      const ws = new WebSocket(`wss://api.packky.com/ws?userId=${admin.userId}&roomId=task_room_v1`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log(`${admin.userId} ✅ WebSocket connected`);
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("📩 Socket Message:", message);
          setSocketData(message);
          setApiCall((prev) => !prev);
        } catch (e) {
          console.error("❌ Failed to parse socket message", e);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        ws.close(); // Force close to trigger reconnect
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket disconnected");

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts, 10000); // Exponential backoff
          console.log(`🔁 Reconnecting in ${delay / 1000}s...`);
          reconnectTimeout.current = setTimeout(connectWebSocket, delay);
          reconnectAttempts++;
        } else {
          console.error("🚫 Max reconnect attempts reached.");
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) socketRef.current.close();
      clearTimeout(reconnectTimeout.current);
    };
  }, [admin?.userId]);

  // 🚀 Fetch Teams
  const FetchTeamCall = async () => {
    try {
      const UserDetail = { userid: "9" };
      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/getDriverTeamList`,
        UserDetail,
      { headers: { 'Authorization': `Basic ${token}` } }
      );

      if (response.data.responseCode === "00") {
        // toast.success(response.data.responseMessage);
        setTeams(response.data.data);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error fetching Driver Teams");
    }
  };

  useEffect(() => {
    FetchTeamCall();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        baseurl,
        token,
        team,
        setTeam,
        searchQueryGlobal,
        setSearchQueryGlobal,
        teams,
        selectedTeam,
        setSelectedTeam,
        FetchTeamCall,
        accessToken,
        setAccessToken,
        ApiCall,
        setApiCall,
        setIsUnauthorised,
        IsUnauthorised,
        socketData,
        AdminId,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}

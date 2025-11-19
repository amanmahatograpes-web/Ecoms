import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../GlobalContext";

export default function LogoutWatcher() {
  const { isUnauthorised, setAdmin } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUnauthorised) {
        console.log("its working")
      sessionStorage.removeItem("admin");
      setAdmin(null);
      localStorage.clear();
      navigate("/login");
    }
  }, [isUnauthorised]);

  return null; // This component just watches, renders nothing
}

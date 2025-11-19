import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GlobalProvider } from "./GlobalContext";
import MainLayout from "./Components/MainLayout";
import MapDashboard from "./Components/MainDashboard/MapDashboard";
import SettingsPage from "./Components/SettingsPage";
import TeamsPage from "./Components/Teams/TeamsPage";
import DriversPage from "./Components/Driver/DriversPage";
import BankPage from "./Components/Banks/BankPage";
import TasksPage from "./Components/Tasks/TasksPage";
import ReportsPage from "./Components/Reports/ReportsPage";
import LoginPage from "./Components/Login/LoginPage";
import ShopsPage from "./Components/Shops/ShopsPage";
import LogoutWatcher from "./Components/Utils/LogoutWatcher";
import { Toaster } from "react-hot-toast";
import "./App.css";
import SlotManager from "./Components/Gigs/SlotManager";
import TierSection from "./Components/Tier/Tier";

function App() {
  const isAuthenticated = sessionStorage.getItem("admin") !== null;

  return (
    <Router>
      <GlobalProvider>
        <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <Route path="/" element={<MainLayout />}>
              {/* Placed inside layout */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<><LogoutWatcher /><MapDashboard /></>} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="driver" element={<DriversPage />} />
              <Route path="banks" element={<BankPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="shops" element={<ShopsPage />} />
                <Route path="slots" element={<SlotManager />} />
                <Route path="tiers" element={<TierSection />} />
              <Route path="notifications" element={<div className="p-4">Notifications Page</div>} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;

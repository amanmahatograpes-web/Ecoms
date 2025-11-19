import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useGlobalContext } from "../../GlobalContext";

const gradientMap = {
  Beginner: "from-green-200 to-green-400",
  Intermediate: "from-blue-200 to-blue-400",
  Advanced: "from-purple-200 to-purple-400",
  Expert: "from-pink-200 to-pink-400",
  Master: "from-yellow-200 to-yellow-400",
};

const TierSection = () => {
  const { baseurl, token, setIsUnauthorised } = useGlobalContext();
  const [tiers, setTiers] = useState([]);
  const [filteredTiers, setFilteredTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  // Fetch Driver List
  const FetchDriverCall = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/getDriverList`,
        { userid: "" },
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        // toast.success(response.data.responseMessage);
        setDrivers(response.data.data);
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

  // Fetch Tier List
  const FetchTierCall = async (driverId = "") => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/getTierList`,
        { driverId },
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
        setTiers(response.data.data);
        setFilteredTiers(response.data.data);
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error fetching Tiers");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    FetchDriverCall();
    FetchTierCall();
  }, []);

  // Tier Filter
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === "All") {
      setFilteredTiers(tiers);
    } else {
      setFilteredTiers(tiers.filter((tier) => tier.tier_title === value));
    }
  };

  // Driver Select Handler
  const handleDriverChange = (e) => {
    const driverId = e.target.value;
    setSelectedDriver(driverId);
    FetchTierCall(driverId);
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        {/* Header + Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 flex-wrap">
          <h2 className="text-2xl font-semibold text-gray-800">Your Tiers</h2>

          {/* Tier Title Filter */}
          <select
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="All">All Tiers</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
            <option value="Master">Master</option>
          </select>

          {/* Driver Filter */}
          <select
            value={selectedDriver}
            onChange={handleDriverChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.driverId}>
                {driver.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading tiers...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-gradient-to-br ${
                  gradientMap[tier.tier_title] || "from-gray-100 to-gray-200"
                } rounded-2xl p-6 shadow-lg hover:scale-[1.03] transition-transform duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 drop-shadow-sm">
                    {tier.tier_title}
                  </h3>
                  <span className="text-sm px-2 py-1 rounded-full flex items-center gap-1 bg-white text-red-600">
                    <Lock className="w-4 h-4" />
                    {tier.status}
                  </span>
                </div>
                <p className="text-sm text-gray-800 mb-3 font-medium drop-shadow-sm">
                  {tier.tier_description}
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  Benefit:{" "}
                  <span className="text-gray-900 font-bold">{tier.benefits}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TierSection;

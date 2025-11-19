// ShopsPage.jsx
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../GlobalContext";
import axios from "axios";
import { Toaster, toast } from 'sonner';

export default function ShopsPage() {
  const { baseurl, accessToken, setIsUnauthorised } = useGlobalContext();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    shopCode: "",
    shopAddress: "",
    shopName: "",
    shopPhone: "",
    shopPinCode: "",
    shopPanCard: "",
    shopGst: "",
  });

  const fetchShops = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseurl}/api/Shop/v1.0/getShopList`,
        { userid: "" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
        setShops(response.data.data);
      } else if (response.data.responseCode==="401"){
          setIsUnauthorised(true);

        }else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error fetching shops");
    } finally {
      setLoading(false);
    }
  };

  const handleAddShop = async () => {
    try {
      const response = await axios.post(
        `${baseurl}/api/Shop/v1.0/onboardShop`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
        fetchShops();
        setFormData({
          shopCode: "",
          shopAddress: "",
          shopName: "",
          shopPhone: "",
          shopPinCode: "",
          shopPanCard: "",
          shopGst: "",
        });
        setActiveTab("list");
      }else if (response.data.responseCode==="401"){
          setIsUnauthorised(true);

        } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error adding shop");
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("list")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "list"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Shop List
          </button>
          <button
            onClick={() => setActiveTab("onboarding")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "onboarding"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Onboarding
          </button>
        </nav>
      </div>

      {activeTab === "list" ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded w-full max-w-md"
              onChange={(e) => {
                const val = e.target.value.toLowerCase();
                setShops((prev) =>
                  prev.filter((s) =>
                    s.shop_name.toLowerCase().includes(val) ||
                    s.shop_code.toLowerCase().includes(val)
                  )
                );
              }}
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => fetchShops()}
              >
                Refresh
              </button>
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded"
                onClick={() => window.print()}
              >
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Shop Code</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Latitude</th>
                    <th className="px-4 py-2">Longitude</th>
                    <th className="px-4 py-2">Onboarded On</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr key={shop.id} className="border-t">
                      <td className="px-4 py-2">{shop.shop_code}</td>
                      <td className="px-4 py-2">{shop.shop_name}</td>
                      <td className="px-4 py-2">{shop.shop_address}</td>
                      <td className="px-4 py-2">{shop.shop_phone}</td>
                      <td className="px-4 py-2">{shop.shop_latitude}</td>
                      <td className="px-4 py-2">{shop.shop_longitude}</td>
                      <td className="px-4 py-2">{shop.onboardedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              className="p-3 border rounded"
              placeholder={key.replace("shop", "Shop ")}
              value={formData[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
            />
          ))}
          <button
            className="md:col-span-2 bg-green-600 text-white p-3 rounded"
            onClick={handleAddShop}
          >
            Add Shop
          </button>
        </div>
      )}
    </div>
  );
}

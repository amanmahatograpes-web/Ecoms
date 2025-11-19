// BankPage.jsx
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../GlobalContext";
import axios from "axios";
import { Toaster, toast } from 'sonner';

import { Plus, RefreshCcw } from "lucide-react";



export default function BankPage() {
  const { baseurl, accessToken, setIsUnauthorised } = useGlobalContext();
  const [banks, setBanks] = useState([]);
  const [search, setSearch] = useState("");
   const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseurl}/api/Driver/v1.0/getBankList`,
          { userid: "" },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.data.responseCode === "00") {
          toast.success(response.data.responseMessage);
          setBanks(response.data.data);
        } else if (response.data.responseCode==="401"){
          setIsUnauthorised(true);

        } else {
          toast.error(response.data.responseMessage);
        }
      } catch (error) {
        toast.error("Error fetching shops");
      } finally {
        setLoading(false);
      }
    };
     useEffect(() => {
    fetchBanks();
  }, []);
  

const filtered = banks.filter((bank) =>
  bank.first_name?.toLowerCase().includes(search.toLowerCase()) ||
  bank.last_name?.toLowerCase().includes(search.toLowerCase()) ||
  bank.driver_code?.toLowerCase().includes(search.toLowerCase()) ||
  bank.bank_name?.toLowerCase().includes(search.toLowerCase()) ||
  bank.account_no?.includes(search) ||
  bank.ifsc_code?.toLowerCase().includes(search.toLowerCase()) ||
  bank.pan_no?.toLowerCase().includes(search.toLowerCase()) ||
  bank.aadhar_no?.includes(search)
);


  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Driver Bank Accounts</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
            <Plus size={16} /> <span>Add Driver Bank</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow">
            <RefreshCcw size={16} /> <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by bank or driver name..."
          className="w-full md:w-1/3 p-2 border rounded shadow-sm"
        />
      </div>

      <div className="overflow-x-auto border rounded-md shadow-sm">
    <table className="min-w-full bg-white">
  <thead>
    <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
      <th className="px-4 py-2">ID</th>
      <th className="px-4 py-2">Bank Name</th>
      <th className="px-4 py-2">Bank Icon</th>
      <th className="px-4 py-2">Driver Name</th>
      <th className="px-4 py-2">Account Number</th>
      <th className="px-4 py-2">IFSC Code</th>
      <th className="px-4 py-2">Aadhar Number</th>
      <th className="px-4 py-2">Pan Number</th>
      <th className="px-4 py-2">Email</th>
      <th className="px-4 py-2">Phone</th>
    </tr>
  </thead>
  <tbody>
    {currentData.map((bank) => (
      <tr key={bank.id} className="text-sm border-t">
        <td className="px-4 py-2">{bank.id}</td>
        <td className="px-4 py-2 font-medium">{bank.bank_name}</td>
        <td className="px-4 py-2">
          <img src={`/assets/bank-icons/${bank.bank_icon}`} alt="icon" className="h-6 w-6" />
        </td>
        <td className="px-4 py-2">{`${bank.first_name} ${bank.last_name}`}</td>
        <td className="px-4 py-2">{bank.account_no}</td>
        <td className="px-4 py-2">{bank.ifsc_code}</td>
        <td className="px-4 py-2">{bank.aadhar_no}</td>
        <td className="px-4 py-2">{bank.pan_no}</td>
        <td className="px-4 py-2">{bank.email}</td>
        <td className="px-4 py-2">{bank.phone}</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      <div className="flex justify-end items-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

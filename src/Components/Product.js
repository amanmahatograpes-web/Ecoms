import React, { useState, useEffect } from "react";
import { Search, Filter, Package, User, Calendar, DollarSign } from "lucide-react";

const AmazonOrderManagement = ({ orders = [] }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    filterData();
  }, [orders, search, statusFilter]);

  const filterData = () => {
    let updated = [...orders];

    // Search filter
    if (search.trim() !== "") {
      updated = updated.filter(
        (o) =>
          o.orderId.toLowerCase().includes(search.toLowerCase()) ||
          o.customerName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      updated = updated.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(updated);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Amazon Order Management</h2>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow w-full md:w-1/3">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            className="ml-2 outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow">
          <Filter size={18} className="text-gray-500 mr-2" />
          <select
            className="outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order List */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">Order ID</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Product</th>
              <th className="py-3">Status</th>
              <th className="py-3">Date</th>
              <th className="py-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId} className="border-b hover:bg-gray-100">
                <td className="py-3 font-medium">{order.orderId}</td>

                <td className="py-3 flex items-center gap-2">
                  <User size={16} />
                  {order.customerName}
                </td>

                <td className="py-3 flex items-center gap-2">
                  <Package size={16} />
                  {order.productTitle}
                </td>

                <td className="py-3 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm
                    ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "processing"
                        ? "bg-blue-500"
                        : order.status === "shipped"
                        ? "bg-indigo-500"
                        : order.status === "delivered"
                        ? "bg-green-600"
                        : "bg-red-500"
                    }
                  `}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="py-3 flex items-center gap-2">
                  <Calendar size={16} />
                  {order.date}
                </td>

                <td className="py-3 flex items-center gap-1 font-semibold">
                  <DollarSign size={16} />
                  {order.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AmazonOrderManagement;

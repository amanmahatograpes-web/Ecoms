// FBAServiceDashboard.jsx
// Full responsive React single-file component for an FBA (Fulfillment by Amazon) service UI
// - Uses Tailwind CSS for styling
// - Uses axios for API calls (dynamic endpoints)
// - Uses recharts for simple charts
// - Uses lucide-react for icons
// Instructions:
// 1. Ensure Tailwind CSS is configured in your project.
// 2. Install dependencies: axios, recharts, lucide-react, react-modal (optional)
//    npm i axios recharts lucide-react react-modal
// 3. Set REACT_APP_API_BASE in your .env to your backend base URL (e.g. https://api.example.com)
// 4. This file exports a default React component. Import and mount in your app.

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Search, PlusCircle, Package, Truck, BarChart3, Download, RefreshCw } from 'lucide-react';
import Modal from 'react-modal';

// --- Helper: API client ---
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// --- Accessible modal root ---
Modal.setAppElement('#root');

// --- Utility hooks ---
function useFetch(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    API.get(path)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: () => API.get(path).then(r => setData(r.data)) };
}

// --- Main component ---
export default function FBAServiceDashboard() {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showCreateShipment, setShowCreateShipment] = useState(false);

  // Data: inventory, shipments, fees, forecasts
  const { data: inventory, loading: invLoading, error: invError, refetch: refetchInventory } = useFetch('/inventory', []);
  const { data: shipments, loading: shipLoading, error: shipError, refetch: refetchShipments } = useFetch('/shipments', []);
  const { data: fees, loading: feesLoading, error: feesError, refetch: refetchFees } = useFetch('/fees', []);
  const { data: forecast, loading: forecastLoading } = useFetch('/forecast/30days', []);

  // Derived filtered inventory
  const filteredInventory = useMemo(() => {
    if (!inventory) return [];
    const q = search.trim().toLowerCase();
    if (!q) return inventory;
    return inventory.filter(item => (item.sku + item.title + (item.asin||'')).toLowerCase().includes(q));
  }, [inventory, search]);

  // Actions
  const createShipment = async (payload) => {
    // payload: { name, items: [{ sku, qty }], destination }
    try {
      const res = await API.post('/shipments', payload);
      setShowCreateShipment(false);
      await refetchShipments();
      await refetchInventory();
      return res.data;
    } catch (err) {
      console.error('Create shipment failed', err);
      throw err;
    }
  };

  const exportInventoryCSV = async () => {
    try {
      const res = await API.get('/inventory/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  // Simple dashboard metrics
  const totalSku = inventory ? inventory.length : 0;
  const totalUnits = inventory ? inventory.reduce((s, i) => s + (i.quantity || 0), 0) : 0;
  const inboundShipments = shipments ? shipments.filter(s => s.status === 'INBOUND').length : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`transition-all duration-200 ${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r h-screen p-4`}> 
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
              <Package className="w-6 h-6" />
              {sidebarOpen && <h1 className="text-lg font-semibold">FBA Service</h1>}
            </div>
            <button aria-label="toggle" onClick={() => setSidebarOpen(v => !v)} className="p-1 rounded hover:bg-slate-100">
              <MenuIcon collapsed={!sidebarOpen} />
            </button>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon={<BarChart3 />} label="Dashboard" open={sidebarOpen} />
            <SidebarItem icon={<Package />} label="Inventory" open={sidebarOpen} />
            <SidebarItem icon={<Truck />} label="Shipments" open={sidebarOpen} />
            <SidebarItem icon={<Download />} label="Reports" open={sidebarOpen} />
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search SKU, title or ASIN..."
                  className="w-full md:w-96 pl-10 pr-3 py-2 rounded border bg-white"
                  aria-label="search inventory"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              </div>
              <button onClick={() => setShowCreateShipment(true)} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded">
                <PlusCircle className="w-4 h-4" /> Create Shipment
              </button>
              <button onClick={exportInventoryCSV} className="inline-flex items-center gap-2 bg-slate-200 px-3 py-2 rounded">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button onClick={() => { refetchInventory(); refetchShipments(); refetchFees(); }} className="inline-flex items-center gap-2 bg-slate-200 px-3 py-2 rounded">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            <div className="flex gap-3">
              <MetricCard label="SKUs" value={totalSku} />
              <MetricCard label="Units" value={totalUnits} />
              <MetricCard label="Inbound" value={inboundShipments} />
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded shadow-sm">
              <h2 className="font-semibold mb-4">Inventory</h2>
              <InventoryTable items={filteredInventory} loading={invLoading} error={invError} onRefetch={refetchInventory} onSelect={(it) => console.log('select', it)} />
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="font-semibold mb-4">Fees & Forecast</h2>
              <FeesSummary fees={fees} loading={feesLoading} />

              <div className="h-52 mt-4">
                <h3 className="text-sm font-medium mb-2">30-day forecast</h3>
                <ForecastChart data={forecast || []} loading={forecastLoading} />
              </div>
            </div>
          </section>

          <section className="mt-6 bg-white p-4 rounded shadow-sm">
            <h2 className="font-semibold mb-4">Shipments</h2>
            <ShipmentsList shipments={shipments} loading={shipLoading} onSelect={s => setSelectedShipment(s)} />
          </section>

        </main>
      </div>

      {/* Create Shipment Modal */}
      <Modal isOpen={showCreateShipment} onRequestClose={() => setShowCreateShipment(false)} className="max-w-2xl mx-auto mt-20 bg-white p-4 rounded shadow-lg outline-none">
        <CreateShipmentForm onCancel={() => setShowCreateShipment(false)} onCreate={createShipment} inventory={inventory || []} />
      </Modal>
    </div>
  );
}

// --- Small components ---
function MenuIcon({ collapsed }) {
  return (
    <button className="p-1">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={collapsed ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
    </button>
  );
}

function SidebarItem({ icon, label, open }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer">
      <div className="w-6 h-6">{icon}</div>
      {open && <span className="text-sm">{label}</span>}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm text-center min-w-[80px]">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value ?? '—'}</div>
    </div>
  );
}

function InventoryTable({ items, loading, error, onRefetch, onSelect }) {
  if (loading) return <div>Loading inventory...</div>;
  if (error) return <div className="text-red-600">Failed to load inventory</div>;
  if (!items || items.length === 0) return <div>No inventory found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600 border-b">
            <th className="py-2">SKU</th>
            <th className="py-2">Title</th>
            <th className="py-2">Available</th>
            <th className="py-2">Inbound</th>
            <th className="py-2">Reserved</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.sku} className="border-b hover:bg-slate-50">
              <td className="py-3">{item.sku}</td>
              <td className="py-3">{item.title}</td>
              <td className="py-3">{item.quantity ?? 0}</td>
              <td className="py-3">{item.inbound ?? 0}</td>
              <td className="py-3">{item.reserved ?? 0}</td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button onClick={() => onSelect(item)} className="px-2 py-1 rounded bg-slate-100">View</button>
                  <button onClick={() => navigator.clipboard?.writeText(item.sku)} className="px-2 py-1 rounded bg-slate-100">Copy SKU</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShipmentsList({ shipments, loading, onSelect }) {
  if (loading) return <div>Loading shipments...</div>;
  if (!shipments || shipments.length === 0) return <div>No shipments found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600 border-b">
            <th className="py-2">ID</th>
            <th className="py-2">Name</th>
            <th className="py-2">Status</th>
            <th className="py-2">Created</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map(s => (
            <tr key={s.id} className="border-b hover:bg-slate-50">
              <td className="py-3">{s.id}</td>
              <td className="py-3">{s.name}</td>
              <td className="py-3">{s.status}</td>
              <td className="py-3">{new Date(s.createdAt).toLocaleDateString()}</td>
              <td className="py-3"><button onClick={() => onSelect(s)} className="px-2 py-1 rounded bg-slate-100">Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeesSummary({ fees, loading }) {
  if (loading) return <div>Loading fees...</div>;
  if (!fees) return <div>No fee data</div>;

  // Example: fees: { storageMonthly: 123.45, fcProcessing: 67.89 }
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between"><span className="text-sm text-slate-600">Monthly storage</span><b>₹{fees.storageMonthly?.toFixed(2) ?? '—'}</b></div>
        <div className="flex justify-between"><span className="text-sm text-slate-600">Fulfillment fees</span><b>₹{fees.fulfillment?.toFixed(2) ?? '—'}</b></div>
        <div className="flex justify-between"><span className="text-sm text-slate-600">Inbound processing</span><b>₹{fees.inbound?.toFixed(2) ?? '—'}</b></div>
      </div>
    </div>
  );
}

function ForecastChart({ data, loading }) {
  if (loading) return <div>Loading forecast...</div>;
  if (!data || data.length === 0) return <div>No forecast</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="expectedSales" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CreateShipmentForm({ onCancel, onCreate, inventory }) {
  const [name, setName] = useState('Inbound ' + new Date().toISOString().slice(0,10));
  const [destination, setDestination] = useState('FC-IN-001');
  const [items, setItems] = useState([]);
  const [addingSku, setAddingSku] = useState('');
  const [addingQty, setAddingQty] = useState(1);
  const [saving, setSaving] = useState(false);

  const addLine = () => {
    if (!addingSku) return;
    setItems(prev => [...prev, { sku: addingSku, qty: Number(addingQty) }]);
    setAddingSku('');
    setAddingQty(1);
  };

  const removeLine = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    setSaving(true);
    try {
      await onCreate({ name, destination, items });
    } catch (err) {
      alert('Failed to create shipment');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Create Inbound Shipment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded" placeholder="Shipment name" />
        <input value={destination} onChange={e => setDestination(e.target.value)} className="p-2 border rounded" placeholder="Destination FC" />
      </div>

      <div className="mb-2">
        <div className="flex gap-2">
          <select value={addingSku} onChange={e => setAddingSku(e.target.value)} className="flex-1 p-2 border rounded">
            <option value="">Select SKU to add</option>
            {inventory.map(i => <option key={i.sku} value={i.sku}>{i.sku} — {i.title}</option>)}
          </select>
          <input type="number" value={addingQty} onChange={e => setAddingQty(e.target.value)} className="w-24 p-2 border rounded" min={1} />
          <button onClick={addLine} className="px-3 py-2 bg-emerald-600 text-white rounded">Add</button>
        </div>
      </div>

      <div className="mb-3">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-600"><th>SKU</th><th>Qty</th><th></th></tr></thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border-b"><td className="py-2">{it.sku}</td><td className="py-2">{it.qty}</td><td className="py-2"><button onClick={() => removeLine(idx)} className="px-2 py-1 rounded bg-slate-100">Remove</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
        <button onClick={submit} disabled={saving || items.length===0} className="px-3 py-2 rounded bg-emerald-600 text-white">{saving ? 'Creating...' : 'Create Shipment'}</button>
      </div>
    </div>
  );
}


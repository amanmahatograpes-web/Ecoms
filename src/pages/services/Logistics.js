// LogisticsDashboard.jsx
// A full, responsive React single-file logistics dashboard inspired by Amazon's logistics UI.
// - Uses Tailwind CSS for responsive layout (mobile/tablet/desktop/large desktop)
// - Uses axios for dynamic API calls
// - Uses lucide-react for icons
// - No external modal library (custom Tailwind modal included)
// - Exports a single React component ready to drop into your app
//
// Setup:
// 1. Ensure Tailwind CSS is configured.
// 2. Install dependencies: axios, lucide-react
//    npm i axios lucide-react
// 3. Set REACT_APP_API_BASE in .env to your backend base URL (e.g. https://api.example.com)
// 4. Import and render <LogisticsDashboard /> in your app.

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Search, Truck, Box, MapPin, DollarSign, FileText, Calendar, Plus, RefreshCw, Download } from 'lucide-react';

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:4000/api' });

export default function LogisticsDashboard() {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [shipments, setShipments] = useState([]);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [carriers, setCarriers] = useState([]);
  const [rates, setRates] = useState(null);
  const [filters, setFilters] = useState({ status: 'ALL' });

  // Fetch initial data
  useEffect(() => { fetchCarriers(); fetchShipments(); }, []);

  async function fetchShipments() {
    setLoadingShipments(true);
    try {
      const q = query ? `?q=${encodeURIComponent(query)}&status=${filters.status}` : `?status=${filters.status}`;
      const res = await API.get(`/logistics/shipments${q}`);
      setShipments(res.data || []);
    } catch (err) {
      console.error('fetchShipments', err);
    } finally { setLoadingShipments(false); }
  }

  async function fetchCarriers() {
    try {
      const res = await API.get('/logistics/carriers');
      setCarriers(res.data || []);
    } catch (err) { console.error('fetchCarriers', err); }
  }

  // Derived
  const filtered = useMemo(() => {
    if (!query) return shipments;
    const q = query.toLowerCase();
    return shipments.filter(s => (s.trackingNumber + s.recipient?.name + s.orderId).toLowerCase().includes(q));
  }, [shipments, query]);

  // Actions
  async function openShipment(shp) {
    try {
      const res = await API.get(`/logistics/shipments/${shp.id}`);
      setSelected(res.data);
    } catch (err) {
      console.error('openShipment', err);
      setSelected(shp); // fallback to lightweight data
    }
  }

  async function createShipment(payload) {
    // payload: { orderId, recipient, items: [{ sku, qty, weight }], carrierId, service, pickupDate }
    try {
      const res = await API.post('/logistics/shipments', payload);
      setShowCreate(false);
      await fetchShipments();
      return res.data;
    } catch (err) { throw err; }
  }

  async function calculateRates({ weightKg, lengthCm, widthCm, heightCm, fromPincode, toPincode }) {
    try {
      const res = await API.post('/logistics/rates', { weightKg, lengthCm, widthCm, heightCm, fromPincode, toPincode });
      setRates(res.data);
    } catch (err) { console.error('calculateRates', err); }
  }

  async function downloadLabel(id) {
    try {
      const res = await API.get(`/logistics/shipments/${id}/label`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `label_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error('downloadLabel', err); }
  }

  // UI layout
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`transition-all duration-200 ${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r h-screen p-4`}> 
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
              <Truck className="w-6 h-6" />
              {sidebarOpen && <h1 className="text-lg font-semibold">Logistics</h1>}
            </div>
            <button onClick={() => setSidebarOpen(v => !v)} className="p-1 rounded hover:bg-gray-100"> 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
            </button>
          </div>

          <nav className="space-y-2">
            <NavItem icon={<Box />} label="Shipments" open={sidebarOpen} />
            <NavItem icon={<MapPin />} label="Tracking" open={sidebarOpen} />
            <NavItem icon={<Calendar />} label="Pickups" open={sidebarOpen} />
            <NavItem icon={<FileText />} label="Reports" open={sidebarOpen} />
          </nav>

          <div className="mt-6">
            <button onClick={() => setShowCreate(true)} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded">
              <Plus className="w-4 h-4" /> New Shipment
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tracking#, order#, recipient..." className="w-full md:w-96 pl-10 pr-3 py-2 rounded border bg-white" />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>

              <button onClick={fetchShipments} className="inline-flex items-center gap-2 bg-gray-200 px-3 py-2 rounded">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>

              <div className="flex items-center gap-2">
                <select value={filters.status} onChange={(e) => { setFilters(s => ({ ...s, status: e.target.value })); }} className="p-2 border rounded">
                  <option value="ALL">All</option>
                  <option value="IN_TRANSIT">In transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Metric label="Total" value={shipments.length} />
              <Metric label="Carriers" value={carriers.length} />
              <Metric label="Rates" value={rates ? Object.keys(rates).length : '—'} />
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded shadow-sm">
              <h2 className="font-semibold mb-4">Shipments</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-2">Tracking</th>
                      <th className="py-2">Recipient</th>
                      <th className="py-2">Carrier</th>
                      <th className="py-2">Service</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingShipments ? <tr><td colSpan={6} className="py-4">Loading…</td></tr> : null}
                    {filtered.map(s => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{s.trackingNumber || '—'}</td>
                        <td className="py-3">{s.recipient?.name || s.recipient?.addressLine1 || '—'}</td>
                        <td className="py-3">{s.carrier?.name || '—'}</td>
                        <td className="py-3">{s.service || '—'}</td>
                        <td className="py-3">{s.status}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openShipment(s)} className="px-2 py-1 rounded bg-gray-100">Details</button>
                            <button onClick={() => downloadLabel(s.id)} className="px-2 py-1 rounded bg-gray-100 inline-flex items-center gap-2"><Download className="w-4 h-4"/>Label</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="font-semibold mb-4">Rate Calculator</h2>
              <RateCalculator onCalculate={calculateRates} carriers={carriers} rates={rates} />
            </div>
          </section>

          <section className="mt-6 bg-white p-4 rounded shadow-sm">
            <h2 className="font-semibold mb-4">Selected Shipment</h2>
            {selected ? (
              <ShipmentDetails shipment={selected} />
            ) : (
              <div className="text-gray-500">Select a shipment to view details</div>
            )}
          </section>
        </main>
      </div>

      {/* Create shipment modal (custom) */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
          <div className="fixed inset-0 bg-black opacity-40" onClick={() => setShowCreate(false)}></div>
          <div className="relative bg-white rounded shadow-lg max-w-2xl w-full z-10 p-4">
            <CreateShipmentForm carriers={carriers} onCancel={() => setShowCreate(false)} onCreate={createShipment} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Subcomponents ---
function NavItem({ icon, label, open }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
      <div className="w-6 h-6">{icon}</div>
      {open && <span className="text-sm">{label}</span>}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm text-center min-w-[90px]">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value ?? '—'}</div>
    </div>
  );
}

function RateCalculator({ onCalculate, carriers, rates }) {
  const [weight, setWeight] = useState(1);
  const [len, setLen] = useState(10);
  const [wid, setWid] = useState(10);
  const [hei, setHei] = useState(10);
  const [fromPincode, setFromPincode] = useState('');
  const [toPincode, setToPincode] = useState('');

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input className="p-2 border rounded" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} placeholder="Weight (kg)" />
        <input className="p-2 border rounded" type="number" value={len} onChange={e => setLen(Number(e.target.value))} placeholder="Length (cm)" />
        <input className="p-2 border rounded" type="number" value={wid} onChange={e => setWid(Number(e.target.value))} placeholder="Width (cm)" />
        <input className="p-2 border rounded" type="number" value={hei} onChange={e => setHei(Number(e.target.value))} placeholder="Height (cm)" />
        <input className="p-2 border rounded" value={fromPincode} onChange={e => setFromPincode(e.target.value)} placeholder="From pincode" />
        <input className="p-2 border rounded" value={toPincode} onChange={e => setToPincode(e.target.value)} placeholder="To pincode" />
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => onCalculate({ weightKg: weight, lengthCm: len, widthCm: wid, heightCm: hei, fromPincode, toPincode })} className="px-3 py-2 bg-blue-600 text-white rounded inline-flex items-center gap-2"><DollarSign className="w-4 h-4" />Calculate</button>
        <button onClick={() => console.log('Export rates')} className="px-3 py-2 bg-gray-200 rounded inline-flex items-center gap-2"><Download className="w-4 h-4"/>Export</button>
      </div>

      <div className="mt-3">
        {rates ? (
          <div className="text-sm">
            {Object.entries(rates).map(([carrier, opts]) => (
              <div key={carrier} className="border p-2 rounded mb-2">
                <div className="font-medium">{carrier}</div>
                {opts.map((o, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <div>{o.service}</div>
                    <div>₹{o.price}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No rates calculated</div>
        )}
      </div>
    </div>
  );
}

function ShipmentDetails({ shipment }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="mb-2"><b>Tracking</b>: {shipment.trackingNumber || '—'}</div>
        <div className="mb-2"><b>Order</b>: {shipment.orderId || '—'}</div>
        <div className="mb-2"><b>Carrier</b>: {shipment.carrier?.name || '—'}</div>
        <div className="mb-2"><b>Status</b>: {shipment.status || '—'}</div>

        <div className="mt-4">
          <h3 className="font-medium">Recipient</h3>
          <div>{shipment.recipient?.name}</div>
          <div>{shipment.recipient?.addressLine1}</div>
          <div>{shipment.recipient?.city}, {shipment.recipient?.state} - {shipment.recipient?.pincode}</div>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Items</h3>
          <table className="w-full text-sm mt-2">
            <thead><tr className="text-left text-gray-600"><th className="py-2">SKU</th><th className="py-2">Qty</th><th className="py-2">Weight</th></tr></thead>
            <tbody>
              {(shipment.items || []).map((it, i) => (
                <tr key={i} className="border-b"><td className="py-2">{it.sku}</td><td className="py-2">{it.qty}</td><td className="py-2">{it.weightKg ?? '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Last update</div>
          <div className="font-medium">{shipment.lastEvent || '—'}</div>
          <div className="text-xs text-gray-400">{shipment.lastEventAt ? new Date(shipment.lastEventAt).toLocaleString() : ''}</div>
        </div>

        <div className="mt-3">
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded">Create Return</button>
        </div>
      </div>
    </div>
  );
}

function CreateShipmentForm({ onCancel, onCreate, carriers = [] }) {
  const [orderId, setOrderId] = useState('');
  const [recipient, setRecipient] = useState({ name: '', addressLine1: '', city: '', state: '', pincode: '' });
  const [items, setItems] = useState([{ sku: '', qty: 1, weightKg: 0.5 }]);
  const [carrierId, setCarrierId] = useState(carriers[0]?.id || '');
  const [service, setService] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [saving, setSaving] = useState(false);

  const addLine = () => setItems(prev => [...prev, { sku: '', qty: 1, weightKg: 0.5 }]);
  const removeLine = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  async function submit() {
    setSaving(true);
    try {
      await onCreate({ orderId, recipient, items, carrierId, service, pickupDate });
    } catch (err) {
      alert('Failed to create shipment');
      console.error(err);
    } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">New Shipment</h3>
        <button onClick={onCancel} className="text-gray-500">Close</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input value={orderId} onChange={e => setOrderId(e.target.value)} className="p-2 border rounded" placeholder="Order ID" />
        <select value={carrierId} onChange={e => setCarrierId(e.target.value)} className="p-2 border rounded">
          <option value="">Select carrier</option>
          {carriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={service} onChange={e => setService(e.target.value)} className="p-2 border rounded" placeholder="Service (e.g. express)" />
        <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="p-2 border rounded" />
      </div>

      <div className="mt-3">
        <h4 className="font-medium">Recipient</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <input value={recipient.name} onChange={e => setRecipient(r => ({ ...r, name: e.target.value }))} className="p-2 border rounded" placeholder="Name" />
          <input value={recipient.pincode} onChange={e => setRecipient(r => ({ ...r, pincode: e.target.value }))} className="p-2 border rounded" placeholder="Pincode" />
          <input value={recipient.addressLine1} onChange={e => setRecipient(r => ({ ...r, addressLine1: e.target.value }))} className="p-2 border rounded md:col-span-2" placeholder="Address" />
          <input value={recipient.city} onChange={e => setRecipient(r => ({ ...r, city: e.target.value }))} className="p-2 border rounded" placeholder="City" />
          <input value={recipient.state} onChange={e => setRecipient(r => ({ ...r, state: e.target.value }))} className="p-2 border rounded" placeholder="State" />
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-medium">Items</h4>
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center mt-2">
            <input value={it.sku} onChange={e => setItems(prev => prev.map((p, i) => i===idx ? { ...p, sku: e.target.value } : p))} className="p-2 border rounded" placeholder="SKU" />
            <input type="number" value={it.qty} onChange={e => setItems(prev => prev.map((p, i) => i===idx ? { ...p, qty: Number(e.target.value) } : p))} className="p-2 border rounded" placeholder="Qty" />
            <input type="number" value={it.weightKg} onChange={e => setItems(prev => prev.map((p, i) => i===idx ? { ...p, weightKg: Number(e.target.value) } : p))} className="p-2 border rounded" placeholder="Weight (kg)" />
            <div className="flex gap-2">
              <button onClick={() => removeLine(idx)} className="px-3 py-2 bg-gray-100 rounded">Remove</button>
            </div>
          </div>
        ))}
        <div className="mt-2">
          <button onClick={addLine} className="px-3 py-2 bg-gray-200 rounded inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Add item</button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
        <button onClick={submit} disabled={saving} className="px-3 py-2 rounded bg-blue-600 text-white">{saving ? 'Saving...' : 'Create'}</button>
      </div>
    </div>
  );
}


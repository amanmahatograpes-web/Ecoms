import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [filters, setFilters] = useState({ q: "", status: "", fulfillment: "" });
  const [stats, setStats] = useState({ total:0, active:0, outOfStock:0, ipi:0 });
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    const res = await api.get(`/products`, { params: { ...filters, page } });
    setProducts(res.data.products || []);
    setStats(prev => ({ ...prev, total: res.data.total }));
  };

  useEffect(() => { fetchProducts(); }, [filters, page]);

  const toggleSelect = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const bulkUpdate = async (update) => {
    await api.post(`/products/bulk-update`, { ids: Array.from(selected), update });
    fetchProducts();
    setSelected(new Set());
  };

  const bulkDelete = async () => {
    await api.post(`/products/bulk-delete`, { ids: Array.from(selected) });
    fetchProducts();
    setSelected(new Set());
  };

  return (
    <div className="page-products">
      <section className="stats-row">
        <div className="stat-card">Total <b>{stats.total}</b></div>
        <div className="stat-card">Active <b>{stats.active}</b></div>
        <div className="stat-card">OutOfStock <b>{stats.outOfStock}</b></div>
        <div className="stat-card">IPI <b>{stats.ipi}</b></div>
      </section>

      <section className="search-row">
        <input className="search-input" placeholder="Search by Name, SKU, ASIN, FNSKU" value={filters.q}
          onChange={e => setFilters({...filters, q: e.target.value})} />
        <select value={filters.status} onChange={e => setFilters({...filters, status:e.target.value})}>
          <option value="">All statuses</option>
          <option>Active</option><option>OutOfStock</option><option>Suppressed</option><option>Incomplete</option><option>Stranded</option>
        </select>
        <select value={filters.fulfillment} onChange={e => setFilters({...filters, fulfillment:e.target.value})}>
          <option value="">Any fulfillment</option><option>FBA</option><option>FBM</option>
        </select>
      </section>

      <section className="bulk-actions">
        <button onClick={() => bulkUpdate({ "price.regular": 9.99 })}>Update Price</button>
        <button onClick={() => bulkUpdate({ "inventory.qty": 10 })}>Update Qty</button>
        <button onClick={() => bulkUpdate({ status: "Inactive" })}>Update Status</button>
        <button onClick={bulkDelete}>Delete</button>
        <span>{selected.size} selected</span>
      </section>

      <table className="product-table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => {
              if (e.target.checked) setSelected(new Set(products.map(p=>p._id)));
              else setSelected(new Set());
            }} /></th>
            <th>SKU</th><th>Title</th><th>Price</th><th>Qty</th><th>Status</th><th>Metrics</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className={p.status === "OutOfStock" ? "row-out" : ""}>
              <td><input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} /></td>
              <td>{p.sku}</td>
              <td>
                <div className="title-cell">
                  <img src={p.images?.[0]||"/placeholder.png"} alt="" className="thumb" />
                  <div>
                    <div className="title">{p.title}</div>
                    <div className="meta">{p.brand} • {p.category}</div>
                  </div>
                </div>
                {p.variations?.length>0 && <div className="variations">Variations: {p.variations.map(v=>v.name).join(", ")}</div>}
              </td>
              <td>{p.price?.regular}</td>
              <td>{p.inventory?.qty}</td>
              <td><span className={`status-badge status-${p.status}`}>{p.status}</span></td>
              <td>
                <div>Rank: {p.salesRank || "-"}</div>
                <div>BuyBox: {p.buyBoxPercent||0}%</div>
                <div>Quality: {p.listingQuality}%</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

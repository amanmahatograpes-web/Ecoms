import React from "react";

export default function Dashboard(){
  return (
    <div className="page-dashboard">
      <div className="card-row">
        <div className="card">Total Sales<br/><b>$12,345</b></div>
        <div className="card">Units Sold<br/><b>1,234</b></div>
        <div className="card">Conversion<br/><b>3.2%</b></div>
        <div className="card">IPI Score<br/><b>85</b></div>
      </div>

      <div className="analytics-grid">
        <div className="panel">Top Products (placeholder)</div>
        <div className="panel">Inventory Health (placeholder)</div>
      </div>
    </div>
  );
}

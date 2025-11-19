import React, { useState } from "react";
import { api } from "../api";

export default function BulkUpload(){
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(null);

  const downloadTemplate = (category="default") => {
    // create CSV template on client or fetch from server
    const csv = "sku,title,brand,category,price,qty\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `template_${category}.csv`;
    a.click();
  };

  const upload = async () => {
    if (!file) return;
    setProcessing(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/upload/csv", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus(res.data);
    } catch (err) {
      setStatus({ error: true, message: err.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-upload">
      <div className="upload-actions">
        <button onClick={()=>downloadTemplate("default")}>Download Template</button>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={upload} disabled={processing}>{processing?"Processing...":"Upload"}</button>
      </div>
      <div className="upload-status">{status && JSON.stringify(status)}</div>
    </div>
  );
}

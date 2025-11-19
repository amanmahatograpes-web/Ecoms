import React, { useState } from "react";
import { api } from "../api";

const steps = ["Identity","Details","Images","Pricing","SEO"];

export default function ProductWizard(){
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    sku:"", title:"", brand:"", category:"", gtin:"", skuType:"",
    variations:[], bullets: ["","","","",""], description:"", condition:"New", dims:{}, images:[], videoUrl:"",
    price:{ regular:0, sale:0, b2b:0 }, inventory:{ qty:0 }, fulfillment:"FBM",
    backendKeywords: "", compliance: {}
  });
  const [loading, setLoading] = useState(false);

  const next = ()=> setStep(s=> Math.min(s+1, steps.length-1));
  const prev = ()=> setStep(s=> Math.max(s-1,0));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/products", data);
      alert("Product created");
      // reset or navigate
    } catch(e){ alert("Create failed"); }
    setLoading(false);
  };

  return (
    <div className="wizard-shell">
      <div className="wizard-steps">
        {steps.map((s,i)=> <div key={s} className={`step ${i===step?"active":""}`}>{i+1}. {s}</div>)}
      </div>

      <div className="wizard-body">
        {step===0 && (
          <div className="step-pane">
            <label>SKU<input value={data.sku} onChange={e=>setData({...data, sku:e.target.value})} className="amazon-input" /></label>
            <label>Title<input value={data.title} onChange={e=>setData({...data, title:e.target.value})} className="amazon-input" /></label>
            <label>Brand<input value={data.brand} onChange={e=>setData({...data, brand:e.target.value})} className="amazon-input" /></label>
            <label>Category<input value={data.category} onChange={e=>setData({...data, category:e.target.value})} className="amazon-input" /></label>
            <label>GTIN<input value={data.gtin} onChange={e=>setData({...data, gtin:e.target.value})} className="amazon-input" /></label>
          </div>
        )}
        {step===1 && (
          <div className="step-pane">
            <label>Variations (JSON sample)</label>
            <textarea className="amazon-textarea" value={JSON.stringify(data.variations)} onChange={e=>setData({...data, variations: JSON.parse(e.target.value||"[]")})} />
            <label>Bullets</label>
            {data.bullets.map((b,i)=> <input key={i} className="amazon-input" value={b} onChange={e=>{ const arr=[...data.bullets]; arr[i]=e.target.value; setData({...data, bullets:arr}) }} />)}
            <label>Description (HTML)</label>
            <textarea className="amazon-textarea" value={data.description} onChange={e=>setData({...data, description:e.target.value})} />
          </div>
        )}
        {step===2 && (
          <div className="step-pane">
            <label>Images (URLs comma separated)</label>
            <input className="amazon-input" value={(data.images||[]).join(",")} onChange={e=>setData({...data, images: e.target.value.split(",").map(s=>s.trim())})} />
            <label>Video URL</label>
            <input className="amazon-input" value={data.videoUrl} onChange={e=>setData({...data, videoUrl: e.target.value})} />
          </div>
        )}
        {step===3 && (
          <div className="step-pane">
            <label>Regular Price<input className="amazon-input" value={data.price.regular} onChange={e=>setData({...data, price:{...data.price, regular: Number(e.target.value)}})} /></label>
            <label>Sale Price<input className="amazon-input" value={data.price.sale} onChange={e=>setData({...data, price:{...data.price, sale: Number(e.target.value)}})} /></label>
            <label>Qty<input className="amazon-input" value={data.inventory.qty} onChange={e=>setData({...data, inventory:{...data.inventory, qty: Number(e.target.value)}})} /></label>
            <label>Fulfillment<select value={data.fulfillment} onChange={e=>setData({...data, fulfillment:e.target.value})}><option>FBM</option><option>FBA</option></select></label>
          </div>
        )}
        {step===4 && (
          <div className="step-pane">
            <label>Backend Keywords<textarea className="amazon-textarea" value={data.backendKeywords} onChange={e=>setData({...data, backendKeywords:e.target.value})} /></label>
            <label>Compliance (json)<textarea className="amazon-textarea" value={JSON.stringify(data.compliance)} onChange={e=>setData({...data, compliance: JSON.parse(e.target.value||"{}")})} /></label>
          </div>
        )}
      </div>

      <div className="wizard-footer">
        {step>0 && <button onClick={prev} className="amazon-btn-outline">Back</button>}
        {step < steps.length-1 && <button onClick={next} className="amazon-btn">Next</button>}
        {step === steps.length-1 && <button onClick={handleSubmit} className="amazon-btn" disabled={loading}>{loading?"Saving...":"Save & Publish"}</button>}
      </div>
    </div>
  );
}

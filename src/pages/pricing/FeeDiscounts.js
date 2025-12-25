import React, { useState, useMemo } from "react";
import { Percent, DollarSign } from "lucide-react";

const FeeDiscounts = () => {
  const [price, setPrice] = useState("");
  const [feePercentage, setFeePercentage] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const tiers = [
    { id: 1, label: "Up to ₹500", discount: 10 },
    { id: 2, label: "₹500 – ₹1,000", discount: 15 },
    { id: 3, label: "₹1,000 – ₹5,000", discount: 20 },
    { id: 4, label: "Above ₹5,000", discount: 25 },
  ];

  // Calculate based on price
  const selectedTier = useMemo(() => {
    const p = Number(price);
    if (p <= 500) return tiers[0];
    if (p <= 1000) return tiers[1];
    if (p <= 5000) return tiers[2];
    return tiers[3];
  }, [price]);

  const calculatedFee = useMemo(() => {
    if (!price || !feePercentage) return 0;
    return (Number(price) * Number(feePercentage)) / 100;
  }, [price, feePercentage]);

  const discountAmount = useMemo(() => {
    if (!calculatedFee) return 0;
    const d = discountPercentage || selectedTier.discount;
    return (calculatedFee * Number(d)) / 100;
  }, [calculatedFee, discountPercentage, selectedTier.discount]);

  const finalFee = calculatedFee - discountAmount;

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <DollarSign /> Amazon-style Fee Discounts
      </h2>

      {/* ---- Inputs ---- */}
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Product Price (₹)"
          className="border p-2 w-full rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amazon Fee %"
          className="border p-2 w-full rounded"
          value={feePercentage}
          onChange={(e) => setFeePercentage(e.target.value)}
        />

        <input
          type="number"
          placeholder="Custom Discount % (optional)"
          className="border p-2 w-full rounded"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
        />
      </div>

      {/* ---- Discount Tier Table ---- */}
      <div className="mt-5">
        <h3 className="font-semibold mb-2">Amazon Discount Tiers</h3>

        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Price Range</th>
              <th className="p-2">Discount %</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr
                key={t.id}
                className={`border-t ${
                  selectedTier.id === t.id ? "bg-yellow-50" : ""
                }`}
              >
                <td className="p-2">{t.label}</td>
                <td className="p-2 font-semibold">{t.discount}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Summary ---- */}
      <div className="mt-5 p-4 rounded-lg bg-gray-50 border">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Percent /> Calculation Summary
        </h3>

        <p><strong>Base Fee:</strong> ₹{calculatedFee.toFixed(2)}</p>
        <p><strong>Discount:</strong> ₹{discountAmount.toFixed(2)}</p>
        <p className="text-green-600 font-bold text-lg">
          Final Fee: ₹{finalFee.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default FeeDiscounts;

import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Data = mongoose.model("Data", dataSchema);

export const uploadJson = async (req, res) => {
  try {
    const jsonData = req.body;
    if (!jsonData || Object.keys(jsonData).length === 0)
      return res.status(400).json({ success: false, message: "No data provided" });

    const saved = await Data.create(jsonData);
    res.status(201).json({ success: true, message: "Data saved", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getData = async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

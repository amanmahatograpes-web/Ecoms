// const mongoose = require('mongoose');

// const dataSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     email: String
// }, { strict: false }); // strict:false allows any JSON structure

// module.exports = mongoose.model('Data', dataSchema);


// import mongoose from "mongoose";

// const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// export default mongoose.model("Data", dataSchema);


import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export default mongoose.model("Data", dataSchema);



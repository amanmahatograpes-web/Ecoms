// import express from "express";
// import { uploadJson } from "./controllers/dataController.js";

// const router = express.Router();

// router.post("/upload-json", uploadJson);

// export default router;
import express from "express";
import { uploadJson, getData } from "../controller/dataController.js";

const router = express.Router();

router.post("/upload", uploadJson);
router.get("/", getData);

export default router;

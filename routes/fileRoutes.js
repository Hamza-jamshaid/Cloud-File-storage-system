const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  generateSASUrl
} = require("../controllers/fileController");

const router = express.Router();

// Store file in memory before upload
const upload = multer({ storage: multer.memoryStorage() });

// Upload route
router.post("/upload/:folder", upload.single("file"), uploadFile);

// Generate secure link
router.get("/download/:folder/:filename", generateSASUrl);

module.exports = router;

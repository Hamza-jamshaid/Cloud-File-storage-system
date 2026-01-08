require("dotenv").config();
const express = require("express");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// API routes
app.use("/api/files", fileRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

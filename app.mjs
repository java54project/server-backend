import fs from "fs";
import https from "https";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./src/routes/auth.mjs";
import pointRoutes from "./src/routes/points.mjs";
import mapStylesRoute from "./src/routes/map.mjs";
import uploadRoutes from "./src/routes/upload.mjs";
import logger from "./src/middleware/logger.mjs";

// environment veriables
dotenv.config();
//const __dirname = path.resolve();

const app = express();

// Middleware
app.use(cors()); //for crossnetworks communications
app.use(express.json()); 

// Connection to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB started"))
  .catch((err) => logger.error("Error to contact MongoDB:", err));

// Routes TODO
// app.use("/api/auth", authRoutes);
// app.use("/api/points", pointRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/maps", mapStylesRoute);

// error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(err.status || 500).json({
    message: err.message || "intrinsic error of the server",
  });
});

//For developement mode use localhost base url fot making paths
const getBaseUrl = (port) => {
    if (process.env.NODE_ENV === "development") {
      logger.info("Detected local environment");
      return `http://localhost:${port}`;
    }
    return `https://volchenko.click:${port}`;
  };

//  HTTP to HTTPS (only in production mode)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// reading sertificates for HTTPS (in production)
let sslOptions = {};
if (process.env.NODE_ENV === "production") {
  sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/volchenko.click/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/volchenko.click/fullchain.pem"),
  };
}

// Server start
const PORT = process.env.PORT || 5001;

const startServer = () => {
  const baseUrl = getBaseUrl(PORT);

  const serverCallback = async () => {
    logger.info(
      `${process.env.NODE_ENV === "production" ? "HTTPS" : "HTTP"} Server running on port: ${PORT}`
    );
  };

  if (process.env.NODE_ENV === "production") {
    https.createServer(sslOptions, app).listen(PORT, serverCallback);
  } else {
    app.listen(PORT, serverCallback);
  }
};

startServer();
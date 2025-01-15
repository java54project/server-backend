import fs from "fs";
import https from "https";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.mjs";
import logger from "./src/middleware/logger.mjs";


// Load environment variables
dotenv.config();


const requiredEnv = ['MONGO_URI', 'NODE_ENV'];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
	throw new Error(`Missing required environment variable: ${env}`);
  }
});


const app = express();


// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("Error connecting to MongoDB:", err));


// Routes
app.use("/api/auth", authRoutes);
// Add other routes as needed


// Error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message || err}`);
  res.status(err.status || 500).json({
	message: err.message || "Internal server error",
  });
});


// Determine base URL
const getBaseUrl = (port) => {
  if (process.env.NODE_ENV === "development") {
	logger.info("Detected local environment");
	return `http://localhost:${port}`;
  }
  return `https://volchenko.click:${port}`;
};


// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
	if (!req.secure) {
  	return res.redirect(`https://${req.headers.host}${req.url}`);
	}
	next();
  });
}


// SSL configuration
let sslOptions = {};
if (process.env.NODE_ENV === "production") {
  if (!fs.existsSync("/etc/letsencrypt/live/volchenko.click/privkey.pem") ||
  	!fs.existsSync("/etc/letsencrypt/live/volchenko.click/fullchain.pem")) {
	throw new Error("SSL certificates not found. Ensure paths are correct.");
  }


  sslOptions = {
	key: fs.readFileSync("/etc/letsencrypt/live/volchenko.click/privkey.pem"),
	cert: fs.readFileSync("/etc/letsencrypt/live/volchenko.click/fullchain.pem"),
  };
}


// Start the server
const PORT = process.env.PORT || 5001;


const startServer = async () => {
  try {
	await mongoose.connect(process.env.MONGO_URI);
	logger.info("MongoDB connected");


	const serverCallback = () => {
  	logger.info(
    	`${process.env.NODE_ENV === "production" ? "HTTPS" : "HTTP"} Server running on port: ${PORT}`
  	);
	};


	if (process.env.NODE_ENV === "production") {
  	https.createServer(sslOptions, app).listen(PORT, serverCallback);
	} else {
  	app.listen(PORT, serverCallback);
	}
  } catch (error) {
	logger.error("Failed to start server:", error);
	process.exit(1);
  }
};


startServer();

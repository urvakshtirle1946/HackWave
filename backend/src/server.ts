import express, { Request, Response } from "express";
import { config } from "./config/config";
import apiRoutes from "./module/index";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (if needed for frontend)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200).end();
  } else {
    next();
  }
});

// API Routes
app.use("/api", apiRoutes);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Supply Chain Management API",
    version: "1.0.0",
    documentation: "/api/endpoints",
    health: "/api/health",
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.listen(config.port, () => {
  console.log(
    `🚀 Supply Chain Management API is running on http://localhost:${config.port}`
  );
  console.log(
    `📚 API Documentation: http://localhost:${config.port}/api/endpoints`
  );
  console.log(`❤️  Health Check: http://localhost:${config.port}/api/health`);
});

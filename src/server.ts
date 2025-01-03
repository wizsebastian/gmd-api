import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { AppDataSource } from "./data-source";
import appointmentRoutes from "./routes/appointmentRoutes";
import productRoutes from "./routes/productRoutes";
import itemPackageRoutes from "./routes/itemPackageRoutes";
import clientRouter from "./routes/ClientRoutes";
import supplierRouter from "./routes/supplierRoutes";
import orderRouter from "./routes/orderRoutes";
import serviceRouter from "./routes/serviceRoutes";

dotenv.config();

const app = express();

// Enable CORS for your frontend origin
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/event-details", appointmentRoutes);
app.use("/products", productRoutes);
app.use("/item-packages", itemPackageRoutes);
app.use("/clients", clientRouter);
app.use("/suppliers", supplierRouter);
app.use("/orders", orderRouter);
app.use("/services", serviceRouter);

const PORT = process.env.PORT || 4080;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => console.log("Database connection error:", error));
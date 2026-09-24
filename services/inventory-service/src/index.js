const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { sequelize } = require("./models");
const inventoryRoutes = require("./routes/inventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const port = process.env.PORT || 5003;

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "ok",
      service: "inventory-service",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({ status: "error", error: error.message });
  }
});

app.use("/inventory", inventoryRoutes);
app.use("/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("[INVENTORY ERROR]", err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal error" });
});

async function connectWithRetry(maxAttempts = 15, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("Inventory DB connected");
      return;
    } catch (error) {
      console.log(
        `[Attempt ${attempt}/${maxAttempts}] DB not ready: ${error.message}`,
      );
      if (attempt === maxAttempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function start() {
  try {
    await connectWithRetry();
    await sequelize.sync({ alter: true });
    console.log("Inventory schema synced");

    app.listen(port, () => {
      console.log(`Inventory Service running on port ${port}`);
    });
  } catch (error) {
    console.error("Inventory service failed to start:", error.message);
    process.exit(1);
  }
}

start();

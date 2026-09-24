const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const sanitize = require("./middleware/sanitize");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(sanitize);
app.set("trust proxy", 1);

const port = process.env.PORT || 5001;

// Local rate limiter as defense-in-depth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});
app.use("/login", authLimiter);
app.use("/register", authLimiter);

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ok", service: "auth-service", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "error", error: error.message });
  }
});

app.use("/", authRoutes);

app.use((err, req, res, next) => {
  console.error("[AUTH ERROR]", err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal error" });
});

async function connectWithRetry(maxAttempts = 15, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("Auth DB connected");
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
    console.log("Auth schema synced");

    app.listen(port, () => {
      console.log(`Auth Service running on port ${port}`);
    });
  } catch (error) {
    console.error("Auth service failed to start:", error.message);
    process.exit(1);
  }
}

start();

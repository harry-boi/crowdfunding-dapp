import express from "express";
import cors from "cors"; // Fix: No destructuring required
import { getAllCampaigns, fetchUserCampaigns } from "./utilities/utilities.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed origins for CORS
const allowedOrigins = [
  "https://crowdfunding-dapp-khaki.vercel.app", // Frontend domain
  "http://localhost:3000", // Local development
];

// Use CORS middleware with proper configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from allowed origins or no origin (e.g., Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"], // Add the HTTP methods you need
    credentials: true, // Include cookies/auth headers if needed
  })
);

// Parse JSON bodies in requests
app.use(express.json());

// API Routes
app.get("/api/campaigns", async (req, res) => {
  try {
    const campaigns = await getAllCampaigns();
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

app.get("/api/campaigns/user-address", async (req, res) => {
  try {
    const userAddress = req.query.userAddress;
    if (!userAddress) {
      return res.status(400).json({ error: "User Address is required" });
    }

    const userCampaigns = await fetchUserCampaigns(userAddress);
    res.json(userCampaigns);
  } catch (error) {
    console.error("Error fetching user campaigns:", error);
    res.status(500).json({ error: "Failed to fetch user campaigns" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

import express from "express";
import cors from "cors"; // Remove curly braces
import { getAllCampaigns, fetchUserCampaigns } from "./utilities/utilities.js";

const app = express();

// Update allowed origins to include localhost:5173
const allowedOrigins = [
  "https://crowdfunding-dapp-khaki.vercel.app", // Production frontend
  "http://localhost:5173", // Development frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"], // Allow specific HTTP methods
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

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
      return res.status(500).json({ error: "User Address is required" });
    }

    const userCampaigns = await fetchUserCampaigns(userAddress);
    res.json(userCampaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user campaigns" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

import express from "express";
import { assert, ethers } from "ethers";
import { getAllCampaigns, fetchUserCampaigns } from "./utilities/utilities.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api/campaigns", async (req, res) => {
  try {
    const campaigns = await getAllCampaigns(); // Await the result
    res.json(campaigns); // Send JSON response
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

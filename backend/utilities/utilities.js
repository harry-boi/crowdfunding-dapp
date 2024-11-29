import { assert, ethers, formatEther, id } from "ethers";
import CrowdfundingAbi from "./CrowdfundingAbi.json" assert { type: "json" };
import { contractAddress } from "./contractRefs.js";
import { rpc_url } from "./contractRefs.js";

const provider = new ethers.JsonRpcProvider(rpc_url);
const ABI = CrowdfundingAbi.abi;
const CampaignStatus = ["Active", "Successful", "Failed"];

const parsedCampaign = (campaign) => {
  return {
    id: Number(campaign[0]),
    creator: campaign[1],
    title: campaign[2],
    description: campaign[3],
    goal: formatEther(campaign[4]),
    duration: Number(campaign[5]) / 86400,
    fundsRaised: formatEther(campaign[6]),
    status: CampaignStatus[Number(campaign[7])],
  };
};

export const getAllCampaigns = async () => {
  const contract = new ethers.Contract(contractAddress, ABI, provider);
  const campaigns = await contract.getAllCampaigns();
  const parsedCampaigns = campaigns.map(parsedCampaign);
  return parsedCampaigns;
};

export const fetchUserCampaigns = async (userAddress) => {
  const contract = new ethers.Contract(contractAddress, ABI, provider);
  const campaigns = await contract.getAllCampaigns();
  const parsedCampaigns = campaigns.map(parsedCampaign);
  const userCampaigns = parsedCampaigns.filter(
    (campaign) => campaign.creator.toLowerCase() == userAddress.toLowerCase()
  );

  return userCampaigns;
};

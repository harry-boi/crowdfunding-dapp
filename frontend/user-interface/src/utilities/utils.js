import { ethers, parseEther } from "ethers";
import { ABI as contractABI, contractAddress } from "./contractRefs";
import CrowdfundingAbi from "./CrowdfundingAbi.json";
import { Contract } from "ethers";

let provider = null;
let signer;

export const createCampaign = async (title, description, goal, duration) => {
  goal = parseEther(goal);
  if (!window.ethereum) {
    alert(
      "Please make sure you have an Ethereum wallet like metamask installed"
    );
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  const contract = new Contract(contractAddress, contractABI, signer);
  try {
    const tx = await contract.createCampaign(
      title,
      description,
      goal,
      duration
    );
    await tx.wait();
    console.log("transaction created successfully..:", tx);
  } catch (error) {
    console.log("an error occurred..", error);
  }
};

export const handleContribute = async (contributionAmount, id) => {
  try {
    // Ensure Ethereum provider is available
    if (!window.ethereum) {
      alert("MetaMask is required to contribute!");
      return;
    }

    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      alert("Please Enter a valid contribution amount");
      return;
    }

    // Connect to MetaMask
    const campaignAddress = contractAddress;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const ABI = CrowdfundingAbi.abi;
    const contract = new Contract(campaignAddress, ABI, signer);
    let amountInWei = parseEther(contributionAmount);

    const usersBalance = await provider.getBalance(signer.getAddress());

    if (amountInWei > usersBalance) {
      alert("The connected wallet does not hold enough funds to contribute!!");
      return;
    }
    const tx = await contract.contribute(id, { value: amountInWei });

    // Wait for transaction confirmation
    await tx.wait();
    alert("Contribution successful!");
  } catch (error) {
    console.error("Error contributing:", error);
    if (error.code == "INSUFFICIENT_FUNDS") {
      alert("You do not have enough ether for this transaction");
    } else if (error.code == "ACTION_REJECTED") {
      alert("you cancelled the transaction");
    } else {
      alert("An error occurred. Please try again.");
    }
  }
};

export const withdrawFunds = async (campaignId) => {
  try {
    if (!window.ethereum) {
      alert("Metamask wallet not found");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const ABI = CrowdfundingAbi.abi;
    const contract = new Contract(contractAddress, ABI, signer);

    const tx = await contract.withdrawFunds(campaignId);
    await tx.wait();

    alert("Funds withdrawn successfully!");
  } catch (error) {
    console.error("Error details:", error);

    // Check for revert reason
    if (error.reason) {
      alert(`Transaction failed: ${error.reason}`);
    } else if (error.data) {
      try {
        // Decode the revert reason from error data
        const decodedError = ethers.utils.toUtf8String(
          "0x" + error.data.substring(138)
        );
        alert(`Transaction failed: ${decodedError}`);
      } catch (decodeError) {
        console.error("Failed to decode revert reason:", decodeError);
        alert("Transaction failed: An unknown error occurred.");
      }
    } else {
      alert(
        `Transaction failed: ${error.message || "An unknown error occurred."}`
      );
    }
  }
};

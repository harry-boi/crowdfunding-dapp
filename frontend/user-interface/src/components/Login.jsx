import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const Login = ({ walletAddress, setWalletAddress }) => {
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (walletAddress) navigate("/dashboard");

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        // const accounts = await provider.send("eth_requestAccounts", []);
        const accountAddresses = accounts.map((account) => account.address);
        setWalletAddress(accountAddresses[0]); // Save the connected wallet address
        navigate("/dashboard"); // Redirect to Dashboard on success
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert(
        "MetaMask not detected. Please install MetaMask to use this feature."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login with Your Wallet</h1>
      {walletAddress ? (
        <p className="text-green-600">Wallet Connected: {walletAddress}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Login;

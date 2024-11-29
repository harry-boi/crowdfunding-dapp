import React, { useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const NavBar = ({ walletAddress, setWalletAddress }) => {
  const [isOpen, setIsOpen] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]); // Save the connected wallet address
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
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <svg
            className="h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2L2 7h20L12 2zm0 0v20m0-20l10 5-10 5m0-5L2 7l10 5"
            />
          </svg>
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white ml-2">
            Crowdy
          </span>
        </Link>

        {/* Hamburger Button */}
        <button
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbar"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>

        {/* Menu */}
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 px-4 rounded md:bg-transparent md:p-0 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Home
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect Wallet Button */}
        <div className="flex items-center space-x-4">
          {walletAddress ? (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

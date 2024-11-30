import { useState, useEffect } from "react";
import React from "react";
import CreateCampaignModal from "./CreateCampaignModal";
import CampaignDetailsModal from "./CampaignDetailsModal";

const Dashboard = ({ walletAddress, setWalletAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    fetch(
      `https://crowdfunding-backend-tcmm.onrender.com/api/campaigns?userAddress=${walletAddress}`
    )
      .then((response) => response.json())
      .then((data) => setUserCampaigns(data));
  }, [walletAddress]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 py-10">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Welcome to Your Dashboard
          </h1>
          <p className="text-white mt-4 text-lg">
            Manage your campaigns seamlessly.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-6 py-3 px-8 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all"
          >
            Create New Campaign
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 space-y-12">
        {/* Campaigns Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Your Campaigns
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Keep track of your active and past campaigns.
          </p>

          {userCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {userCampaigns.map((campaign) => {
                const progress =
                  campaign.goal > 0
                    ? Math.min(
                        (campaign.fundsRaised / campaign.goal) * 100,
                        100
                      )
                    : 0;

                return (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-gray-900">
                      {campaign.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{campaign.description}</p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {campaign.fundsRaised} / {campaign.goal} ETH raised
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setSelectedCampaign(campaign);
                      }}
                      className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-500">
                You haven’t created any campaigns yet.
              </p>
              <button
                onClick={() => setIsOpen(true)}
                className="mt-4 py-3 px-8 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
              >
                Create Your First Campaign
              </button>
            </div>
          )}
        </section>
      </div>

      <CreateCampaignModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <CampaignDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default Dashboard;

import React from "react";
import { withdrawFunds } from "../utilities/utils";
const CampaignDetailsModal = ({ isModalOpen, setIsModalOpen, campaign }) => {
  if (!isModalOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Campaign Details */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {campaign.title}
        </h2>
        <p className="text-gray-600 mb-6">{campaign.description}</p>

        {/* Campaign Progress */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Progress</h3>
          <div className="w-full bg-gray-200 mt-3 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${
                  campaign.goal > 0
                    ? Math.min(
                        (campaign.fundsRaised / campaign.goal) * 100,
                        100
                      )
                    : 0
                }%`,
              }}
            ></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {campaign.fundsRaised} / {campaign.goal} ETH raised
          </p>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="block font-semibold text-gray-800">Duration:</span>
            <span>{campaign.duration + "days"}</span>
          </div>

          <div>
            <span className="block font-semibold text-gray-800">Goal:</span>
            <span>{campaign.goal} ETH</span>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="mt-6">
          <button
            onClick={() => withdrawFunds(campaign.id)}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsModal;

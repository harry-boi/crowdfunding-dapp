import React, { useState } from "react";
import { handleContribute } from "../utilities/utils.js";

const Card = ({
  title,
  description,
  goal,
  status,
  id,
  creator,
  fundsRaised,
  campaignAddress,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState(0);

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h5>
      <p className="mb-3 text-gray-700">{description}</p>
      <p className="mb-3 text-gray-700">
        <b className="font-bold">Owner:</b> {creator.slice(0, 7)}...
        {creator.slice(-5)}
      </p>
      <p className="mb-3 text-gray-600">
        <strong>Goal:</strong> {goal} ETH
      </p>

      <p className="text-gray-500 text-sm mt-2 mb-3 flex justify-between">
        <div>
          {fundsRaised} / {goal} ETH raised{" "}
        </div>{" "}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      </p>
      <div className="w-full bg-gray-200 mt-3 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{
            width: `${
              goal > 0 ? Math.min((fundsRaised / goal) * 100, 100) : 0
            }%`,
          }}
        ></div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Contribute
          <svg
            className="ml-2 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm4 5a1 1 0 102 0v-4a1 1 0 10-2 0v4z" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Contribute to Campaign
            </h2>
            <p className="mb-4 text-gray-600">
              Enter the amount you want to contribute in Ether:
            </p>
            <input
              type="number"
              step="0.01"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="e.g., 0.5"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleContribute(contributionAmount, id)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300"
              >
                Contribute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;

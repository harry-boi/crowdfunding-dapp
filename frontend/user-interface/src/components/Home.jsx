import React, { useEffect, useState } from "react";
import lightBulb from "../assets/images/light-bulb.jpg";
import Card from "./Card";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch("https://crowdfunding-backend-tcmm.onrender.com/api/campaigns")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setCampaigns(data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  return (
    <>
      <section
        className="relative bg-cover bg-center text-white h-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${lightBulb})`,
        }}
      >
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <a
            href={Navigate("/login")}
            className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-300 bg-gray-800 rounded-full hover:bg-gray-700"
            role="alert"
          >
            <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">
              New
            </span>
            <span className="text-sm font-medium">
              Crowdy is the new innovation
            </span>
            <svg
              className="ml-2 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>

          <h1 className="mb-4 text-4xl mt-8 font-extrabold text-gray-100 tracking-tight leading-none md:text-5xl lg:text-6xl">
            Bring your Vision to Life with Crowdy
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-200 lg:text-xl sm:px-16 xl:px-48">
            Crowdy is the platform that empowers entrepreneurs to raise funds
            for their innovative ideas, enabling a brighter future through the
            power of community-driven investment. Whether you're launching a new
            product or supporting a cause, Crowdy makes it easy to connect with
            backers and bring your project to life.
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className="inline-flex bg-blue-600 justify-center items-center py-3 px-5 text-base font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
            >
              Get Started
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div className="my-8 px-4 mx-auto max-w-screen-xl">
        <h2 className="text-2xl font-bold text-center mb-8">Campaigns</h2>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                id={campaign.id}
                title={campaign.title}
                description={campaign.description}
                fundsRaised={campaign.fundsRaised}
                creator={campaign.creator}
                goal={campaign.goal}
                status={campaign.status}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No campaigns found.
          </p>
        )}
      </div>
    </>
  );
};

export default Home;

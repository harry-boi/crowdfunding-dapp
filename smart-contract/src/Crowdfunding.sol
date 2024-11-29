// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Crowdfunding {
    enum CampaignStatus { Active, Successful, Failed }

    struct Campaign {
        address creator;
        string title;
        string description;
        uint goal;
        uint duration;
        uint fundsRaised;
        bool withdrawn;
        CampaignStatus status;
        mapping(address => uint) contributions;
    }

    struct CampaignData {
        uint campaignID;
        address creator;
        string title;
        string description;
        uint goal;
        uint duration;
        uint fundsRaised;
        CampaignStatus status;
    }

    uint public campaignCount;
    mapping(uint => Campaign) public campaigns;
    CampaignData[] public campaignData;

    event CampaignCreated(uint campaignId, address creator, string title, uint goal, uint duration);
    event Contributed(address contributor, uint amount, uint time, uint campaignId);
    event FundsWithdrawn(uint campaignId, address creator, uint amount);
    event Refunded(uint campaignId, address contributor, uint amount);

    modifier onlyCreator(uint _campaignId) {
        require(msg.sender == campaigns[_campaignId].creator, "Not the campaign creator");
        _;
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy allowed");
        locked = true;
        _;
        locked = false;
    }

    bool private locked;

    function createCampaign(string memory _title, string memory _description, uint _goal, uint _duration) public {
        campaignCount++;
        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.duration = block.timestamp + _duration;
        newCampaign.status = CampaignStatus.Active;
        uint fundsRaised = 0;


        campaignData.push(CampaignData(campaignCount, msg.sender, _title, _description, _goal, _duration, fundsRaised, CampaignStatus.Active));

        emit CampaignCreated(campaignCount, msg.sender, _title, _goal, _duration);
    }

    function contribute(uint _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.duration, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than zero");

        campaign.fundsRaised += msg.value;
        campaign.contributions[msg.sender] += msg.value;

        campaignData[_campaignId-1].fundsRaised +=msg.value;

        emit Contributed(msg.sender, msg.value, block.timestamp, _campaignId);
    }

    function withdrawFunds(uint _campaignId) public onlyCreator(_campaignId) noReentrancy {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.withdrawn, "Funds already withdrawn");
        require(campaign.status == CampaignStatus.Active, "Invalid campaign status");
        require(campaign.fundsRaised >= campaign.goal, "Goal not reached");
        require(block.timestamp > campaign.duration, "Campaign not ended");

        campaign.withdrawn = true;
        campaign.status = CampaignStatus.Successful;

        (bool success, ) = payable(campaign.creator).call{value: campaign.fundsRaised}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_campaignId, msg.sender, campaign.fundsRaised);
    }

    function refund(uint _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.duration, "Campaign is active");
        require(campaign.fundsRaised < campaign.goal, "Goal was reached");
        require(campaign.contributions[msg.sender] > 0, "No contributions to refund");

        uint contributedAmount = campaign.contributions[msg.sender];
        campaign.contributions[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: contributedAmount}("");
        require(success, "Refund failed");

        emit Refunded(_campaignId, msg.sender, contributedAmount);
    }

    function getContribution(uint _campaignId, address _contributor) public view returns(uint) {
        return campaigns[_campaignId].contributions[_contributor];
    }

    function getAllCampaigns() public view returns (CampaignData[] memory) {
        return campaignData;
    }

    function checkCampaignStatus(uint _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];

        if (block.timestamp > campaign.duration) {
            if (campaign.fundsRaised >= campaign.goal) {
                campaign.status = CampaignStatus.Successful;
            } else {
                campaign.status = CampaignStatus.Failed;
            }
        }
    }

    function getUserContributions(address _userAddress) public view returns (uint[] memory, uint[] memory) {
        uint totalContributions = 0;

        // First loop to count the number of contributions
        for (uint i = 1; i <= campaignCount; i++) {
            if (campaigns[i].contributions[_userAddress] > 0) {
                totalContributions++;
            }
        }

        // Create arrays to store results
        uint[] memory campaignIds = new uint[](totalContributions);
        uint[] memory amounts = new uint[](totalContributions);

        uint index = 0;

        // Second loop to populate the arrays
        for (uint i = 1; i <= campaignCount; i++) {
            if (campaigns[i].contributions[_userAddress] > 0) {
                campaignIds[index] = i; // Use the loop index as the campaign ID
                amounts[index] = campaigns[i].contributions[_userAddress];
                index++;
            }
        }

        return (campaignIds, amounts); // Return the arrays
    }

}

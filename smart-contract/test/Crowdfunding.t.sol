// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Crowdfunding} from "../src/Crowdfunding.sol";

contract CrowdfundingTest is Test {
    Crowdfunding public crowdfunding;
    address public contributor;
    address public campaignCreator;

    function setUp() public {
        crowdfunding = new Crowdfunding();
        contributor = makeAddr('contributor');
        campaignCreator = makeAddr('campaignCreator');
    }

    function testCreateCampaign() public {
        string memory title = "Build dApp";
        string memory description = "Fundraising for dApp development";
        uint goal = 10 ether;
        uint duration = 30 days;

        // Simulate campaign creation
        crowdfunding.createCampaign(title, description, goal, duration);

        // Access campaign details without including the `contributions` mapping
        (address creator, string memory savedTitle, string memory savedDescription, uint savedGoal, uint savedDuration, uint fundsRaised, bool withdrawn, Crowdfunding.CampaignStatus status) = crowdfunding.campaigns(1);

        // Assert campaign details
        assertEq(creator, address(this)); // msg.sender is the test contract
        assertEq(savedTitle, title);
        assertEq(savedDescription, description);
        assertEq(savedGoal, goal);
        assertEq(savedDuration, block.timestamp + duration);
        assertEq(fundsRaised, 0);
        assertFalse(withdrawn);
        assertEq(uint(status), uint(Crowdfunding.CampaignStatus.Active)); // Check the initial status
    }


    
    function testContribute() public {
        // Create a campaign
        crowdfunding.createCampaign("Test Campaign", "Description", 10 ether, 30 days);
        vm.deal(contributor, 1 ether);
        // Contribute to the campaign
        vm.startPrank(contributor);
        uint contribution = 1 ether;
        crowdfunding.contribute{value: contribution}(1);
        vm.stopPrank();

        // Access campaign details
        (, , , , , uint fundsRaised, , ) = crowdfunding.campaigns(1);
        uint userContribution = crowdfunding.getContribution(1, contributor);

        // Assert contribution details
        assertEq(fundsRaised, contribution);
        assertEq(userContribution, contribution);
    }

    function testWithdrawFunds() public payable {
        // Simulate campaign creation by the creator
        vm.startPrank(campaignCreator);
        crowdfunding.createCampaign("Test Campaign", "Description", 1 ether, 1 days);
        vm.stopPrank();

        // Contribute to the campaign
        crowdfunding.contribute{value: 1 ether}(1);

        // Travel time to simulate campaign end
        skip(2 days);

        // Simulate the creator withdrawing funds
        vm.startPrank(campaignCreator);
        uint initialCreatorBalance = campaignCreator.balance;
        crowdfunding.withdrawFunds(1);
        vm.stopPrank();

        // Assert funds were withdrawn
        uint newCreatorBalance = campaignCreator.balance;
        (, , , , , , bool withdrawn, ) = crowdfunding.campaigns(1);

        assertTrue(withdrawn);
        assertEq(newCreatorBalance, initialCreatorBalance + 1 ether);
    }

    function testOnlyCreatorCanWithdrawFunds() public payable{
        // Simulate campaign creation
        vm.startPrank(campaignCreator);
        crowdfunding.createCampaign("test campaign", "Test description", 1 ether, 1 days);
        vm.stopPrank();

        // Contribute to the campaign
        vm.deal(contributor, 1 ether);
        vm.startPrank(contributor);
        crowdfunding.contribute{value: 1 ether}(1);
        vm.stopPrank();

        // Travelling forward to simulate campaign end
        skip(2 days);

        // Simulate withdrawal by campaign creator
        vm.startPrank(campaignCreator);
        crowdfunding.withdrawFunds(1);
        vm.stopPrank();

        // Assert that funds were withdrawn
        (, , , , , , bool withdrawn, ) = crowdfunding.campaigns(1);
        assertTrue(withdrawn);

        // Simulate unauthorized withdrawal by contributor
        vm.startPrank(contributor);
        vm.expectRevert("Not the campaign creator");
        crowdfunding.withdrawFunds(1);
        vm.stopPrank();

    }

    function testCanGetAllCampaign() public {
        //simulate creating campaign
        vm.startPrank(campaignCreator);
        crowdfunding.createCampaign('test campaign', "test description", 1 ether, 2 days);
        crowdfunding.createCampaign('second test campaign', "second test description", 2 ether, 3 days);
        vm.stopPrank();

        Crowdfunding.CampaignData[] memory campaigns = crowdfunding.getAllCampaigns();
        assertEq(campaigns.length, 2, "There should be 2 campaigns");
        assertEq(campaigns[0].title, "test campaign", "Title of first campaign should be test campaign");

    }

    function testGetUserContributions() public {
        // Simulate creating campaigns
        vm.startPrank(campaignCreator);
        crowdfunding.createCampaign("Campaign 1", "Description 1", 5 ether, 10 days);
        crowdfunding.createCampaign("Campaign 2", "Description 2", 3 ether, 10 days);
        crowdfunding.createCampaign("Campaign 3", "Description 3", 2 ether, 10 days);
        vm.stopPrank();

        // Simulate contributions from a specific user
        vm.deal(contributor, 5 ether);
        vm.startPrank(contributor);
        crowdfunding.contribute{value: 1 ether}(1); // Contribute to Campaign 1
        crowdfunding.contribute{value: 2 ether}(2); // Contribute to Campaign 2
        vm.stopPrank();

        // Call the `getUserContributions` function
        (uint[] memory campaignIds, uint[] memory amounts) = crowdfunding.getUserContributions(contributor);

        // Assert that the returned data matches expected contributions
        assertEq(campaignIds.length, 2, "User should have contributed to 2 campaigns");
        assertEq(campaignIds[0], 1, "First campaign ID should be 1");
        assertEq(campaignIds[1], 2, "Second campaign ID should be 2");

        assertEq(amounts.length, 2, "Amounts array should have 2 entries");
        assertEq(amounts[0], 1 ether, "Contribution to Campaign 1 should be 1 ether");
        assertEq(amounts[1], 2 ether, "Contribution to Campaign 2 should be 2 ether");
    }

    function testFundsRaisedCanUpdate() public {
        //Simulate creating campaign
        vm.startPrank(campaignCreator);
        crowdfunding.createCampaign('testCampaign', 'testDescription', 1 ether, 3 days);
        vm.stopPrank();

        //simulate contribution.
        vm.deal(contributor, 1 ether);
        vm.startPrank(contributor);
        crowdfunding.contribute{value: 1 ether}(1);
        vm.stopPrank();

        // Assert funds raised in campainData
        Crowdfunding.CampaignData[] memory allCampaigns = crowdfunding.getAllCampaigns();
        assertEq(allCampaigns[0].fundsRaised, 1 ether, "The contributed ether should be 1");

    }


}

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract DTrace {
    //=================================
    // UTILs
    //=================================

    using Counters for Counters.Counter;

    //=================================
    // ENUMs
    //=================================

    enum DurianStatus {
        Harvested,
        ArrivedDC,
        ArrivedRT,
        Sold
    }
    enum Rating {
        Bad,
        Poor,
        Fair,
        Good,
        Excellent
    }

    //=================================
    // STRUCTs
    //=================================

    //DURIAN STRUCT
    struct Durian {
        //DURIAN DETAILS
        uint256 durianID;
        DurianStatus status; //default = "Harvested"
        DurianFarmDetails durianFarmDetails;
        DurianDCDetails durianDCDetails;
        DurianRTDetails durianRTDetails;
        DurianCSDetails durianCSDetails;
    }

    //FARM DETAILS IN DURIAN STRUCT
    struct DurianFarmDetails {
        uint256 farmID;
        uint256 treeID;
        // D197, DQ1 (durian sarawak), DB1 (durian belanda)
        string varietyCode;
        //epoch time
        uint256 harvestedTime; //button clicked time
        uint256 durianImg; //ipfs url
        Rating conditionFarm;
    }

    //DISTRIBUTION CENTER DETAILS IN DURIAN STRUCT
    struct DurianDCDetails {
        uint256 distributionCenterID;
        uint256 arrivalTimeDC;
        uint256 durianImg;
        Rating conditionDC;
    }

    //RETAILER DETAILS IN DURIAN STRUCT
    struct DurianRTDetails {
        uint256 retailerID;
        uint256 arrivalTimeRT;
        uint256 durianImg;
        Rating conditionRT;
    }

    //CONSUMER DETAILS IN DURIAN STRUCT
    struct DurianCSDetails {
        uint256 consumerID;
        uint256 soldTime;
        uint256 durianImg;
        Rating taste;
        Rating fragrance;
        Rating creaminess;
    }

    //===Farm, DC, RT, Consumer===

    //FARM STRUCT
    struct Farm {
        uint256 farmID;
        address farmAddress;
        string farmName;
        string farmLocation;
    }

    //DISTRIBUTION CENTER STRUCT
    struct DistributionCenter {
        uint256 distributionCenterID;
        address distributionCenterAddress;
        string distributionCenterName;
        string distributionCenterLocation;
    }

    //RETAILER STRUCT
    struct Retailler {
        uint256 retailerID;
        address retailerAddress;
        string retailerName;
        string retailerLocation;
    }

    //CONSUMER STRUCT
    struct Consumer {
        uint256 consumerID;
        address consumerAddress;
        string consumerName;
    }

    //=================================
    // STATE VARIABLES
    //=================================

    //CONTRACT OWNER ADDRESS
    address public contractOwner;

    //TOTAL NUMBER OF DURIAN, FARM, DC, RT, CONSUMER
    Counters.Counter public durianNum;
    Counters.Counter public farmNum;
    Counters.Counter public distributionCenterNum;
    Counters.Counter public retailerNum;
    Counters.Counter public consumerNum;

    //DURIAN MAPPING
    mapping(uint256 => Durian) public durians;

    //Farm, DC, RT, Consumer MAPPING
    address[] public farmAddress;
    mapping(address => Farm) public farms;

    address[] public distributionCenterAddress;
    mapping(address => DistributionCenter) public distributionCenters;

    address[] public retailerAddress;
    mapping(address => Retailler) public retaillers;

    address[] public consumerAddress;
    mapping(address => Consumer) public consumers;

    //=================================
    // CONSTRUCTOR
    //=================================
    constructor() {
        contractOwner = msg.sender;
    }

    //=================================
    // FARM FUNCTIONS
    //=================================

    //CREATE FARM

    //=================================
    // DISTRIBUTION CENTER FUNCTIONS
    //=================================

    //=================================
    // RETAILER FUNCTIONS
    //=================================

    //=================================
    // CONSUMER FUNCTIONS
    //=================================
}

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract DTrace {
    //COUNTER UTIL
    using Counters for Counters.Counter;

    Counters.Counter public _durianId;

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

    //DURIAN STRUCT
    struct Durian {
        //DURIAN DETAILS
        // uint256 durianID,
        uint256 durianImg; //ipfs url
        //D197, DQ1 (durian sarawak), DB1 (durian belanda)
        string varietyCode;
        DurianStatus status; //default = "Harvested"
        DurianFarmDetails durianFarmDetails;
        DurianDCDetails durianDCDetails;
        DurianRTDetails durianRTDetails;
        DurianCSDetails durianCSDetails;
    }

    struct DurianFarmDetails {
        //FARM DETAILS
        uint256 farmID;
        uint256 treeID;
        uint256 harvestedDate; //button clicked time
    }

    struct DurianDCDetails {
        //DISTRIBUTION CENTER DETAILS
        uint256 distributionCenterID;
        uint256 arrivalTimeDC;
        Rating conditionDC;
    }

    struct DurianRTDetails {
        //RETAILER DETAILS
        uint256 retailerID;
        uint256 arrivalTimeRT;
        Rating conditionRT;
    }

    struct DurianCSDetails {
        //CONSUMER DETAILS
        uint256 consumerID;
        uint256 soldDate;
        Rating taste;
        Rating fragrance;
        Rating creaminess;
    }

    //CONTRACT OWNER ADDRESS
    address public contractOwner;

    //DURIAN MAPPING
    mapping(uint256 => Durian) public durians;

    //CONSTRUCTOR
    constructor() {
        contractOwner = msg.sender;
    }
}

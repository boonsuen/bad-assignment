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
        Sold,
        Rated
    }
    enum Rating {
        Bad,
        Poor,
        Fair,
        Good,
        Excellent
    }

    //=================================
    // STRUCTs & EVENTs
    //=================================

    //DURIAN STRUCT
    struct Durian {
        //DURIAN DETAILS
        uint256 durianID;
        DurianStatus status;
        DurianFarmDetails durianFarmDetails;
        DurianDCDetails durianDCDetails;
        DurianRTDetails durianRTDetails;
        DurianCSDetails durianCSDetails;
    }

    event DurianCreated(uint256 durianID);

    //FARM DETAILS IN DURIAN STRUCT
    struct DurianFarmDetails {
        uint256 farmID;
        uint256 treeID;
        // D197, DQ1 (durian sarawak), DB1 (durian belanda)
        string varietyCode;
        //epoch time
        uint256 harvestedTime; //button clicked time
        string durianImg; //ipfs url
        Rating conditionFarm;
    }

    event DurianFarmDetailsCreated(
        uint256 farmID,
        uint256 treeID,
        string varietyCode,
        uint256 harvestedTime,
        string durianImg,
        Rating conditionFarm
    );

    //DISTRIBUTION CENTER DETAILS IN DURIAN STRUCT
    struct DurianDCDetails {
        uint256 distributionCenterID;
        uint256 arrivalTimeDC;
        string durianImg;
        Rating conditionDC;
    }

    event DurianDCDetailsCreated(
        uint256 distributionCenterID,
        uint256 arrivalTimeDC,
        string durianImg,
        Rating conditionDC
    );

    //RETAILER DETAILS IN DURIAN STRUCT
    struct DurianRTDetails {
        uint256 retailerID;
        uint256 arrivalTimeRT;
        string durianImg;
        Rating conditionRT;
    }

    event DurianRTDetailsCreated(
        uint256 retailerID,
        uint256 arrivalTimeRT,
        string durianImg,
        Rating conditionRT
    );

    //CONSUMER DETAILS IN DURIAN STRUCT
    struct DurianCSDetails {
        uint256 consumerID;
        uint256 soldTime;
        string durianImg;
        Rating taste;
        Rating fragrance;
        Rating creaminess;
    }

    event DurianSold(uint256 consumerID, uint256 soldTime);

    event DurianRated(
        string durianImg,
        Rating taste,
        Rating fragrance,
        Rating creaminess
    );

    //===Farm, DC, RT, Consumer===

    //FARM STRUCT
    struct Farm {
        uint256 farmID;
        address farmAddress;
        string farmName;
        string farmLocation;
    }

    event FarmCreated(
        uint256 farmID,
        address farmAddress,
        string farmName,
        string farmLocation
    );

    //DISTRIBUTION CENTER STRUCT
    struct DistributionCenter {
        uint256 distributionCenterID;
        address distributionCenterAddress;
        string distributionCenterName;
        string distributionCenterLocation;
    }

    event DistributionCenterCreated(
        uint256 distributionCenterID,
        address distributionCenterAddress,
        string distributionCenterName,
        string distributionCenterLocation
    );

    //RETAILER STRUCT
    struct Retailler {
        uint256 retailerID;
        address retailerAddress;
        string retailerName;
        string retailerLocation;
    }

    event RetaillerCreated(
        uint256 retailerID,
        address retailerAddress,
        string retailerName,
        string retailerLocation
    );

    //CONSUMER STRUCT
    struct Consumer {
        uint256 consumerID;
        address consumerAddress;
        string consumerName;
    }

    event ConsumerCreated(
        uint256 consumerID,
        address consumerAddress,
        string consumerName
    );

    //=================================
    // STATE VARIABLES
    //=================================

    //TOTAL NUMBER OF DURIAN, FARM, DC, RT, CONSUMER
    Counters.Counter public durianNum;
    Counters.Counter public farmNum;
    Counters.Counter public distributionCenterNum;
    Counters.Counter public retailerNum;
    Counters.Counter public consumerNum;

    //DURIAN MAPPING
    mapping(uint256 => Durian) public durians;

    //Farm, DC, RT, Consumer MAPPING
    address[] public farmAddresses;
    mapping(address => Farm) public farms;

    address[] public distributionCenterAddresses;
    mapping(address => DistributionCenter) public distributionCenters;

    address[] public retailerAddresses;
    mapping(address => Retailler) public retaillers;

    address[] public consumerAddresses;
    mapping(address => Consumer) public consumers;

    //CONTRACT OWNER & ADMIN
    address public contractOwner;
    address[] public adminAddresses;
    mapping(address => bool) public admins;

    //=================================
    // CONSTRUCTOR
    //=================================
    constructor() {
        contractOwner = msg.sender;
    }

    //=================================
    // FUNCTION MODIFIERS
    //=================================

    //===ROLES===
    //only contract owner or admin
    modifier onlyOwnerOrAdmin() {
        require(
            admins[msg.sender] || msg.sender == contractOwner,
            "Caller is not an admin"
        );
        _;
    }

    //only contract owner, admin, or retailer
    modifier onlyOwnerOrAdminOrRetailer() {
        require(
            admins[msg.sender] ||
                msg.sender == contractOwner ||
                retaillers[msg.sender].retailerAddress == msg.sender,
            "Caller is not an admin or retailer"
        );
        _;
    }

    //only farm
    modifier onlyFarm() {
        require(
            farms[msg.sender].farmAddress == msg.sender,
            "Caller is not a farm"
        );
        _;
    }

    //only distribution center
    modifier onlyDistributionCenter() {
        require(
            distributionCenters[msg.sender].distributionCenterAddress ==
                msg.sender,
            "Caller is not a distribution center"
        );
        _;
    }

    //only retailer
    modifier onlyRetailer() {
        require(
            retaillers[msg.sender].retailerAddress == msg.sender,
            "Caller is not a retailer"
        );
        _;
    }

    //only bought consumer
    modifier onlyBoughtConsumer(uint256 _durianID) {
        require(
            consumerAddresses[
                (durians[_durianID].durianCSDetails.consumerID - 1)
            ] == msg.sender,
            "Caller is not the consumer who bought this durian"
        );
        _;
    }

    //===DURIAN STATUS===
    //only harvested durian
    modifier onlyHarvestedDurian(uint256 _durianID) {
        require(
            durians[_durianID].status == DurianStatus.Harvested,
            "Durian is not harvested"
        );
        _;
    }

    //only arrived DC durian
    modifier onlyArrivedDCDurian(uint256 _durianID) {
        require(
            durians[_durianID].status == DurianStatus.ArrivedDC,
            "Durian is not yet arrived DC"
        );
        _;
    }

    //only arrived RT durian
    modifier onlyArrivedRTDurian(uint256 _durianID) {
        require(
            durians[_durianID].status == DurianStatus.ArrivedRT,
            "Durian is not yet arrived RT"
        );
        _;
    }

    //only sold durian
    modifier onlySoldDurian(uint256 _durianID) {
        require(
            durians[_durianID].status == DurianStatus.Sold,
            "Durian is not sold"
        );
        _;
    }

    //validate time
    modifier validateTime(uint256 _previousTime, uint256 _currentTime) {
        require(_currentTime > _previousTime, "Invalid time");
        _;
    }

    //===================================
    // CHECK ACCOUNT TYPE
    //===================================
    function checkAccountType(
        address _accountAddress
    ) public view returns (string memory) {
        if (admins[_accountAddress] || _accountAddress == contractOwner) {
            return "OwnerOrAdmin";
        } else if (farms[_accountAddress].farmAddress == _accountAddress) {
            return "Farm";
        } else if (
            distributionCenters[_accountAddress].distributionCenterAddress ==
            _accountAddress
        ) {
            return "Distribution Center";
        } else if (
            retaillers[_accountAddress].retailerAddress == _accountAddress
        ) {
            return "Retailer";
        } else if (
            consumers[_accountAddress].consumerAddress == _accountAddress
        ) {
            return "Consumer";
        } else {
            return "Guest";
        }
    }

    //===================================
    // ADMIN & CONTRACT OWNER FUNCTIONS
    //===================================

    //ADD ADMIN
    function addAdmin(address _adminAddress) public onlyOwnerOrAdmin {
        admins[_adminAddress] = true;
        adminAddresses.push(_adminAddress);
    }

    //GET CONTRACT OWNER
    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    //GET ADMIN LIST
    function getAdminList() public view returns (address[] memory) {
        return adminAddresses;
    }

    //GET ADMIN TOTAL
    function getAdminTotal() public view returns (uint256) {
        return adminAddresses.length;
    }

    //GET ADMIN DATA
    function getAdminData(
        address _adminAddress
    ) public view returns (address, bool) {
        return (_adminAddress, admins[_adminAddress]);
    }

    //=================================
    // DURIAN FUNCTIONS
    //=================================

    //===CHECK DURIAN===
    //CHECK TOTAL DURIAN
    function checkTotalDurian() public view returns (uint256) {
        return durianNum.current();
    }

    //CHECK DURIAN STATUS
    function checkDurianStatus(
        uint256 _durianID
    ) public view returns (DurianStatus) {
        return durians[_durianID].status;
    }

    //CHECK DURIAN FARM DETAILS
    function checkDurianFarmDetails(
        uint256 _durianID
    )
        public
        view
        returns (
            uint256,
            uint256,
            string memory,
            uint256,
            string memory,
            Rating
        )
    {
        return (
            durians[_durianID].durianFarmDetails.farmID,
            durians[_durianID].durianFarmDetails.treeID,
            durians[_durianID].durianFarmDetails.varietyCode,
            durians[_durianID].durianFarmDetails.harvestedTime,
            durians[_durianID].durianFarmDetails.durianImg,
            durians[_durianID].durianFarmDetails.conditionFarm
        );
    }

    //CHECK DURIAN DC DETAILS
    function checkDurianDCDetails(
        uint256 _durianID
    ) public view returns (uint256, uint256, string memory, Rating) {
        return (
            durians[_durianID].durianDCDetails.distributionCenterID,
            durians[_durianID].durianDCDetails.arrivalTimeDC,
            durians[_durianID].durianDCDetails.durianImg,
            durians[_durianID].durianDCDetails.conditionDC
        );
    }

    //CHECK DURIAN RT DETAILS
    function checkDurianRTDetails(
        uint256 _durianID
    ) public view returns (uint256, uint256, string memory, Rating) {
        return (
            durians[_durianID].durianRTDetails.retailerID,
            durians[_durianID].durianRTDetails.arrivalTimeRT,
            durians[_durianID].durianRTDetails.durianImg,
            durians[_durianID].durianRTDetails.conditionRT
        );
    }

    //CHECK DURIAN CONSUMER DETAILS
    function checkDurianSoldDetails(
        uint256 _durianID
    ) public view returns (uint256, uint256) {
        return (
            durians[_durianID].durianCSDetails.consumerID,
            durians[_durianID].durianCSDetails.soldTime
        );
    }

    function checkDurianRatingDetails(
        uint256 _durianID
    ) public view returns (string memory, Rating, Rating, Rating) {
        return (
            durians[_durianID].durianCSDetails.durianImg,
            durians[_durianID].durianCSDetails.taste,
            durians[_durianID].durianCSDetails.fragrance,
            durians[_durianID].durianCSDetails.creaminess
        );
    }

    //===ADD & UPDATE DURIAN===
    //ADD NEW DURIAN
    function addDurian(
        uint256 _farmID,
        uint256 _treeID,
        string memory _varietyCode,
        uint256 _harvestedTime,
        string memory _durianImg,
        Rating _conditionFarm
    ) public onlyFarm {
        durianNum.increment();
        uint256 _durianID = durianNum.current();
        durians[_durianID].durianID = _durianID;

        //ADD DURIANFARMDETAILS
        addDurianFarmDetails(
            _durianID,
            _farmID,
            _treeID,
            _varietyCode,
            _harvestedTime,
            _durianImg,
            _conditionFarm
        );
        emit DurianCreated(durians[_durianID].durianID);
    }

    //ADD DURIANFARMDETAILS (onlyFarm)
    function addDurianFarmDetails(
        uint256 _durianID,
        uint256 _farmID,
        uint256 _treeID,
        string memory _varietyCode,
        uint256 _harvestedTime,
        string memory _durianImg,
        Rating _conditionFarm
    ) public onlyFarm validateTime(0, _harvestedTime) {
        DurianFarmDetails memory newDurianFarmDetails = DurianFarmDetails(
            _farmID,
            _treeID,
            _varietyCode,
            _harvestedTime,
            _durianImg,
            _conditionFarm
        );
        durians[_durianID].durianFarmDetails = newDurianFarmDetails;
        durians[_durianID].status = DurianStatus.Harvested;

        emit DurianFarmDetailsCreated(
            _farmID,
            _treeID,
            _varietyCode,
            _harvestedTime,
            _durianImg,
            _conditionFarm
        );
    }

    //ADD DURIANDCDETAILS (onlyDistributionCenter)
    function addDurianDCDetails(
        uint256 _durianID,
        uint256 _distributionCenterID,
        uint256 _arrivalTimeDC,
        string memory _durianImg,
        Rating _conditionDC
    )
        public
        onlyDistributionCenter
        onlyHarvestedDurian(_durianID)
        validateTime(
            durians[_durianID].durianFarmDetails.harvestedTime,
            _arrivalTimeDC
        )
    {
        DurianDCDetails memory newDurianDCDetails = DurianDCDetails(
            _distributionCenterID,
            _arrivalTimeDC,
            _durianImg,
            _conditionDC
        );
        durians[_durianID].durianDCDetails = newDurianDCDetails;
        durians[_durianID].status = DurianStatus.ArrivedDC;

        emit DurianDCDetailsCreated(
            _distributionCenterID,
            _arrivalTimeDC,
            _durianImg,
            _conditionDC
        );
    }

    //ADD DURIANRTDETAILS (onlyRetailer)
    function addDurianRTDetails(
        uint256 _durianID,
        uint256 _retailerID,
        uint256 _arrivalTimeRT,
        string memory _durianImg,
        Rating _conditionRT
    )
        public
        onlyRetailer
        onlyArrivedDCDurian(_durianID)
        validateTime(
            durians[_durianID].durianDCDetails.arrivalTimeDC,
            _arrivalTimeRT
        )
    {
        DurianRTDetails memory newDurianRTDetails = DurianRTDetails(
            _retailerID,
            _arrivalTimeRT,
            _durianImg,
            _conditionRT
        );
        durians[_durianID].durianRTDetails = newDurianRTDetails;
        durians[_durianID].status = DurianStatus.ArrivedRT;

        emit DurianRTDetailsCreated(
            _retailerID,
            _arrivalTimeRT,
            _durianImg,
            _conditionRT
        );
    }

    //SELL DURIAN (onlyRetailer)
    function sellDurian(
        uint256 _durianID,
        uint256 _consumerID,
        uint256 _soldTime
    )
        public
        onlyRetailer
        onlyArrivedRTDurian(_durianID)
        validateTime(
            durians[_durianID].durianRTDetails.arrivalTimeRT,
            _soldTime
        )
    {
        durians[_durianID].durianCSDetails.consumerID = _consumerID;
        durians[_durianID].durianCSDetails.soldTime = _soldTime;
        durians[_durianID].status = DurianStatus.Sold;

        emit DurianSold(_consumerID, _soldTime);
    }

    //RATE DURIAN (onlyConsumer)
    function rateDurian(
        uint256 _durianID,
        string memory _durianImg,
        Rating _taste,
        Rating _fragrance,
        Rating _creaminess
    )
        public
        onlyBoughtConsumer(_durianID)
        onlySoldDurian(_durianID)
        validateTime(
            durians[_durianID].durianCSDetails.soldTime,
            block.timestamp
        )
    {
        durians[_durianID].durianCSDetails.durianImg = _durianImg;
        durians[_durianID].durianCSDetails.taste = _taste;
        durians[_durianID].durianCSDetails.fragrance = _fragrance;
        durians[_durianID].durianCSDetails.creaminess = _creaminess;
        durians[_durianID].status = DurianStatus.Rated;

        emit DurianRated(_durianImg, _taste, _fragrance, _creaminess);
    }

    //=================================
    // FARM FUNCTIONS
    //=================================

    //ADD FARM (onlyOwnerOrAdmin)
    function addFarm(
        address _farmAddress,
        string memory _farmName,
        string memory _farmLocation
    ) public onlyOwnerOrAdmin {
        farmNum.increment();
        uint256 _farmID = farmNum.current();

        Farm memory newFarm = Farm(
            _farmID,
            _farmAddress,
            _farmName,
            _farmLocation
        );
        farms[_farmAddress] = newFarm;
        farmAddresses.push(_farmAddress);

        emit FarmCreated(_farmID, _farmAddress, _farmName, _farmLocation);
    }

    //GET FARM LIST
    function getFarmList() public view returns (address[] memory) {
        return farmAddresses;
    }

    //GET FARM TOTAL
    function getFarmTotal() public view returns (uint256) {
        return farmAddresses.length;
    }

    //GET FARM DATA
    function getFarmData(
        address _farmAddress
    ) public view returns (uint256, address, string memory, string memory) {
        Farm memory _farm = farms[_farmAddress];
        return (
            _farm.farmID,
            _farm.farmAddress,
            _farm.farmName,
            _farm.farmLocation
        );
    }

    //=================================
    // DISTRIBUTION CENTER FUNCTIONS
    //=================================

    //ADD DISTRIBUTION CENTER (onlyOwnerOrAdmin)
    function addDistributionCenter(
        address _distributionCenterAddress,
        string memory _distributionCenterName,
        string memory _distributionCenterLocation
    ) public onlyOwnerOrAdmin {
        distributionCenterNum.increment();
        uint256 _distributionCenterID = distributionCenterNum.current();

        DistributionCenter memory newDistributionCenter = DistributionCenter(
            _distributionCenterID,
            _distributionCenterAddress,
            _distributionCenterName,
            _distributionCenterLocation
        );
        distributionCenters[_distributionCenterAddress] = newDistributionCenter;
        distributionCenterAddresses.push(_distributionCenterAddress);

        emit DistributionCenterCreated(
            _distributionCenterID,
            _distributionCenterAddress,
            _distributionCenterName,
            _distributionCenterLocation
        );
    }

    //GET DISTRIBUTION CENTER LIST
    function getDistributionCenterList()
        public
        view
        returns (address[] memory)
    {
        return distributionCenterAddresses;
    }

    //GET DISTRIBUTION CENTER TOTAL
    function getDistributionCenterTotal() public view returns (uint256) {
        return distributionCenterNum.current();
    }

    //GET DISTRIBUTION CENTER DATA
    function getDistributionCenterData(
        address _distributionCenterAddress
    ) public view returns (uint256, address, string memory, string memory) {
        DistributionCenter memory _distributionCenter = distributionCenters[
            _distributionCenterAddress
        ];
        return (
            _distributionCenter.distributionCenterID,
            _distributionCenter.distributionCenterAddress,
            _distributionCenter.distributionCenterName,
            _distributionCenter.distributionCenterLocation
        );
    }

    //=================================
    // RETAILER FUNCTIONS
    //=================================

    //ADD RETAILER (onlyOwnerOrAdmin)
    function addRetailer(
        address _retailerAddress,
        string memory _retailerName,
        string memory _retailerLocation
    ) public onlyOwnerOrAdmin {
        retailerNum.increment();
        uint256 _retailerID = retailerNum.current();

        Retailler memory newRetailler = Retailler(
            _retailerID,
            _retailerAddress,
            _retailerName,
            _retailerLocation
        );
        retaillers[_retailerAddress] = newRetailler;
        retailerAddresses.push(_retailerAddress);

        emit RetaillerCreated(
            _retailerID,
            _retailerAddress,
            _retailerName,
            _retailerLocation
        );
    }

    //GET RETAILER LIST
    function getRetailerList() public view returns (address[] memory) {
        return retailerAddresses;
    }

    //GET RETAILER TOTAL
    function getRetailerTotal() public view returns (uint256) {
        return retailerNum.current();
    }

    //GET RETAILER DATA
    function getRetailerData(
        address _retailerAddress
    ) public view returns (uint256, address, string memory, string memory) {
        Retailler memory retailler = retaillers[_retailerAddress];
        return (
            retailler.retailerID,
            retailler.retailerAddress,
            retailler.retailerName,
            retailler.retailerLocation
        );
    }

    //=================================
    // CONSUMER FUNCTIONS
    //=================================

    //ADD CONSUMER (onlyOwnerOrAdminOrRetailer)
    function addConsumer(
        address _consumerAddress,
        string memory _consumerName
    ) public onlyOwnerOrAdminOrRetailer {
        consumerNum.increment();
        uint256 _consumerID = consumerNum.current();

        Consumer memory newConsumer = Consumer(
            _consumerID,
            _consumerAddress,
            _consumerName
        );
        consumers[_consumerAddress] = newConsumer;
        consumerAddresses.push(_consumerAddress);

        emit ConsumerCreated(_consumerID, _consumerAddress, _consumerName);
    }

    //GET CONSUMER LIST
    function getConsumerList() public view returns (address[] memory) {
        return consumerAddresses;
    }

    //GET CONSUMER TOTAL
    function getConsumerTotal() public view returns (uint256) {
        return consumerNum.current();
    }

    //GET CONSUMER DATA
    function getConsumerData(
        address _consumerAddress
    ) public view returns (uint256, address, string memory) {
        Consumer memory consumer = consumers[_consumerAddress];
        return (
            consumer.consumerID,
            consumer.consumerAddress,
            consumer.consumerName
        );
    }
}

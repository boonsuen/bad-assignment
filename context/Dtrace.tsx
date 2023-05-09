import React, { useState, useContext, createContext, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { BigNumber, Signer, ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { Rating } from '@/types';

// //Smart Contract
// //might move to constant.ts file
// Smart Contract Address and ABI
import dtrace from '../artifacts/contracts/DTrace.sol/DTrace.json';
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const contractABI = dtrace.abi;

//IPFS
const ipfsProjectId = '2OzjVylKREoBrrmfOhppUk1Zdsc';
const ipfsProjectSecretKey = '36e6243f205dc8e46aa645b89f56862e';

const authorization =
  'Basic ' + btoa(ipfsProjectId + ':' + ipfsProjectSecretKey);
const subdomain = 'https://dtrace.infura-ipfs.io';

const client = ipfsHttpClient({
  host: 'infura-ipfs.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization,
  },
});

export const fetchContract = (signerOrProvider: any) => {
  return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
};

interface DTraceData {
  checkIfWalletIsConnected: () => Promise<boolean>;
  connectWallet: () => Promise<void>;
  uploadToIPFS: (file: any) => Promise<string | undefined>;
  isWalletConnected: boolean;
  currentAccount: string;
  error: string;
  checkRatingStatus: (rating: Rating) => Promise<number>
  checkAccountType: (accountAddress: string) => Promise<string | null>;
  getContractOwner: () => Promise<string>;
  getAdminList: () => Promise<any>;
  getFarmDataList: () => Promise<any>;
  getDistributionCenterDataList: () => Promise<any>;
  getRetailerDataList: () => Promise<any>;
  getConsumerDataList: () => Promise<any>;
  addAdmin: (adminAddress: String) => Promise<void>;
  addFarm: (
    farmAddress: String,
    farmName: String,
    farmLocation: String
  ) => Promise<void>;
  getConsumerTotal: () => Promise<any>;
  addDistributionCenter: (
    distributionCenterAddress: String,
    distributionCenterName: String,
    distributionCenterLocation: String
  ) => Promise<void>;
  getDistributionCenterTotal: () => Promise<any>;
  addRetailer: (
    retailerAddress: String,
    retailerName: String,
    retailerLocation: String
  ) => Promise<void>;
  getRetailerTotal: () => Promise<any>;
  addConsumer: (consumerAddress: String, consumerName: String) => Promise<void>;
  getFarmTotal: () => Promise<any>;
  checkTotalDurian: () => Promise<any>;
  checkDurianDetails: any;
  addDurian: (
    farmID: number,
    treeID: number,
    varietyCode: String,
    harvestedTime: number,
    durianImg: String,
    conditionFarm: number
  ) => Promise<void>;
  getFarmId: (farmAddress: String) => Promise<number>;
  addDurianDCDetails: (
    durianId: number,
    distributionCenterID: number,
    arrivalTimeDC: number,
    durianImg: String,
    conditionDC: number
  ) => Promise<void>;
  getDCId: (DCAddress: String) => Promise<number>;
  addDurianRTDetails: (
    durianId: number,
    retailerID: number,
    arrivalTimeRT: number,
    durianImg: String,
    conditionRT: number
  ) => Promise<void>;
  getRTId: (RTAddress: String) => Promise<number>;
  sellDurian: (
    durianId: number,
    consumerID: number,
    soldTime: number
  ) => Promise<void>;
  rateDurian: (
    durianId: number,
    durianImg: String,
    taste: number,
    fragrance: number,
    creaminess: number
  ) => Promise<void>;
}

type DTraceContextProviderProps = {
  children: React.ReactNode;
};

// const defaultValue: DTraceData[] = [];
const defaultValue = {
  checkIfWalletIsConnected: () => {},
  connectWallet: () => {},
  uploadToIPFS: () => {},
  checkRatingStatus: () => {},
  isWalletConnected: false,
  currentAccount: '',
  error: '',
  checkAccountType: () => {},
  getContractOwner: () => {},
  getAdminList: () => {},
  getFarmDataList: () => {},
  getDistributionCenterDataList: () => {},
  getRetailerDataList: () => {},
  getConsumerDataList: () => {},
  addAdmin: () => {},
  addFarm: () => {},
  addDistributionCenter: () => {},
  addRetailer: () => {},
  addConsumer: () => {},
  checkTotalDurian: () => {},
  checkDurianDetails: () => {},
  addDurian: () => {},
  getFarmId: () => {},
  addDurianDCDetails: () => {},
  getDCId: () => {},
  addDurianRTDetails: () => {},
  getRTId: () => {},
  sellDurian: () => {},
  rateDurian: () => {},
} as unknown as DTraceData;

export const DTraceContext = React.createContext(defaultValue);
// export const DTraceContext = React.createContext<Partial<DTraceData>>([]);

export const DTraceProvider = ({ children }: DTraceContextProviderProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState('');

  // CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask first.');
      return false;
    }
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      setIsWalletConnected(true);
      return true;
    } else {
      setCurrentAccount('');
      setIsWalletConnected(false);
      setError('Connect with Metamask first.');
      return false;
    }
  };

  // CONNECT WALLET
  const connectWallet = async () => {
    console.log('connectWallet');
    if (!window.ethereum) return setError('Please install MetaMask first.');

    const account = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setCurrentAccount(account[0]);
    setIsWalletConnected(true);
  };

  //UPLOAD TO IPFS VOTER IMAGE
  //TODO: restrict to IMAGE file type
  const uploadToIPFS = async (file: any) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log(error);
      setError('Error uploading file to IPFS');
    }
  };

  const checkRatingStatus = async (rating: Rating) => {
    let num: number = 0;
    switch (rating) {
      
      case 'Excellent':
        num = 4;
        break;
      case 'Good':
        num = 3;
        break;
      case 'Fair':
        num = 2;
        break;
      case 'Poor':
        num = 1;
        break;
      case 'Bad':
        num = 0;
        break;
      default:
        console.log('Rating not found');
        break;
    }
    return num;
  };

  const connectSmartContract = async () => {
    // CONNECTING SMART CONTRACT
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    return fetchContract(signer);
  };

  //check account type
  const checkAccountType = async (accountAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const accountType = await contract.checkAccountType(accountAddress);
      return accountType;
    } catch (error) {
      console.error(error);
      setError('Something went wrong in checking account type');
    }
  };

  //all-account.tsx
  const getContractOwner = async () => { //return: ownerAddress
    try {
      const contract = await connectSmartContract();

      const owner = await contract.getContractOwner();
      console.log(owner);
      return owner;
    } catch (error) {
      setError('Something went wrong in getting contract owner');
    }
  };

  const getAdminList = async () => { 
    try {
      const contract = await connectSmartContract();

      const admin = await contract.getAdminList();
      console.log(admin);
      //return: [] of admin addresses
      return admin;
    } catch (error) {
      setError('Something went wrong in getting admin list');
    }
  };

  const getFarmDataList = async () => { 
    try {
      const contract = await connectSmartContract();
      
      const farmLength = parseInt(await contract.getFarmTotal());
      const farmAddresses = await contract.getFarmList();
      console.log(farmAddresses);

      const farmDataPromises = farmAddresses.map(async (farmAddress:any) => {
        const singleFarmData = await contract.getFarmData(farmAddress);
        return singleFarmData;
      });
      
      const farmDataList = await Promise.all(farmDataPromises);
      
      // singleFarmData (in array form):
      // [farmID : number,
      // farmAddress : String,
      // farmName : String,
      // farmLocation : String]

      //return: farmLength:number, [] of singleFarmData
      return {farmLength, farmDataList};
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  const getDistributionCenterDataList = async () => {
    try {
      const contract = await connectSmartContract();

      const distributionCenterLength = parseInt(await contract.getDistributionCenterTotal());
      const distributionCenterAddresses = await contract.getDistributionCenterList();
      console.log(distributionCenterAddresses);
      
      const distributionCenterDataPromises = distributionCenterAddresses.map(async (distributionCenterAddress:any) => {
        const singleDistributionCenterData = await contract.getDistributionCenterData(distributionCenterAddress);
        return singleDistributionCenterData;
      });

      const distributionCenterDataList = await Promise.all(distributionCenterDataPromises);

      // singleDistributionCenterData (in array form):
      // [distributionCenterID : number,
      // distributionCenterAddress : String,
      // distributionCenterName : String,
      // distributionCenterLocation : String]

      //return: distributionCenterLength:number, [] of singleDistributionCenterData
      return {distributionCenterLength, distributionCenterDataList};
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  const getRetailerDataList = async () => {
    try {
      const contract = await connectSmartContract();

      const retailerLength = parseInt(await contract.getRetailerTotal());
      const retailerAddresses = await contract.getRetailerList();
      console.log(retailerAddresses);

      const retailerDataPromises = retailerAddresses.map(async (retailerAddress:any) => {
        const singleRetailerData = await contract.getRetailerData(retailerAddress);
        return singleRetailerData;
      });

      const retailerDataList = await Promise.all(retailerDataPromises);

      // singleRetailerData (in array form):
      // [retailerID : number,
      // retailerAddress : String,
      // retailerName : String,
      // retailerLocation : String]

      //return: retailerLength:number, [] of singleRetailerData
      return {retailerLength, retailerDataList};
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  const getConsumerDataList = async () => {
    try {
      const contract = await connectSmartContract();
      
      const consumerLength = parseInt(await contract.getConsumerTotal());
      const consumerAddresses = await contract.getConsumerList();
      console.log(consumerAddresses);

      const consumerDataPromises = consumerAddresses.map(async (consumerAddress:any) => {
        const singleConsumerData = await contract.getConsumerData(consumerAddress);
        return singleConsumerData;
      });

      const consumerDataList = await Promise.all(consumerDataPromises);

      // singleConsumerData (in array form):
      // [consumerID : number,
      // consumerAddress : String,
      // consumerName : String]

      //return: consumerLength:number, [] of singleConsumerData
      return {consumerLength, consumerDataList};
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  //add-account.tsx
  const addAdmin = async (adminAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const admin = await contract.addAdmin(adminAddress);
      admin.wait();
      console.log(admin);
    } catch (error) {
      setError('Something went wrong in adding admin');
      throw error;
    }
  };

  const getFarmTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const farmTotal:number = (await contract.getFarmTotal()).toNumber();
      console.log(farmTotal);
      return farmTotal;
    } catch (error) {
      setError('Something went wrong in checking total farm');
    }
  };


  const addFarm = async (
    farmAddress: String,
    farmName: String,
    farmLocation: String
  ) => {
    try {
      const contract = await connectSmartContract();

      const farm = await contract.addFarm(farmAddress, farmName, farmLocation);
      farm.wait();
      console.log(farm);
    } catch (error) {
      setError('Something went wrong in adding farm');
      throw error;
    }
  };

  const addDistributionCenter = async (
    distributionCenterAddress: String,
    distributionCenterName: String,
    distributionCenterLocation: String
  ) => {
    try {
      const contract = await connectSmartContract();

      const distributionCenter = await contract.addDistributionCenter(
        distributionCenterAddress,
        distributionCenterName,
        distributionCenterLocation
      );
      distributionCenter.wait();
      console.log(distributionCenter);
    } catch (error) {
      setError('Something went wrong in adding distribution center');
      throw error;
    }
  };

  const getDistributionCenterTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const distributionCenterTotal:number = (await contract.getDistributionCenterTotal()).toNumber();
      console.log(distributionCenterTotal);
      return distributionCenterTotal;
    } catch (error) {
      setError('Something went wrong in checking total distribution center');
    }
  };

  const addRetailer = async (
    retailerAddress: String,
    retailerName: String,
    retailerLocation: String
  ) => {
    try {
      const contract = await connectSmartContract();

      const retailer = await contract.addRetailer(
        retailerAddress,
        retailerName,
        retailerLocation
      );
      retailer.wait();
      console.log(retailer);
    } catch (error) {
      setError('Something went wrong in adding retailer');
      throw error;
    }
  };

  const getRetailerTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const retailerTotal:number = (await contract.getRetailerTotal()).toNumber();
      console.log(retailerTotal);
      return retailerTotal;
    } catch (error) {
      setError('Something went wrong in checking total retailer');
    }
  };

  //add-account.tsx, add-consumer.tsx
  const addConsumer = async (consumerAddress: String, consumerName: String) => {
    try {
      const contract = await connectSmartContract();

      const consumer = await contract.addConsumer(
        consumerAddress,
        consumerName
      );
      consumer.wait();
      console.log(consumer);
    } catch (error) {
      setError('Something went wrong in adding consumer');
      throw error;
    }
  };

  const getConsumerTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const consumerTotal:number = (await contract.getConsumerTotal()).toNumber();
      console.log(consumerTotal);
      return consumerTotal;
    } catch (error) {
      setError('Something went wrong in checking total consumer');
    }
  };

  //check.tsx

  const checkDurianDetails = async (durianId: number) => {
    try {
      const contract = await connectSmartContract();

      const status = await contract.checkDurianStatus(durianId);
      console.log(status);

      switch (status) {
        case 0: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          return { status, farmDetails };
        }
        case 1: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          return { status, farmDetails, DCDetails };
        }
        case 2: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          const RTDetails = await contract.checkDurianRTDetails(durianId);
          return { status, farmDetails, DCDetails, RTDetails };
        }
        case 3: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          const RTDetails = await contract.checkDurianRTDetails(durianId);
          const soldDetails = await contract.checkDurianSoldDetails(durianId);
          return { status, farmDetails, DCDetails, RTDetails, soldDetails };
        }
        case 4: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          const RTDetails = await contract.checkDurianRTDetails(durianId);
          const soldDetails = await contract.checkDurianSoldDetails(durianId);
          const ratingDetails = await contract.checkDurianRatingDetails(
            durianId
          );
          return {
            status, 
            farmDetails,
            DCDetails,
            RTDetails,
            soldDetails,
            ratingDetails,
          };
        }
        default:
          console.log('Durian not found');
          break;
      }
    } catch (error) {
      setError('Something went wrong in checking durian details');
    }
  };

  //add-durian.tsx
  const addDurian = async (
    farmID: number,
    treeID: number,
    varietyCode: String,
    harvestedTime: number,
    durianImg: String,
    conditionFarm: number
  ) => {
    try {
      const contract = await connectSmartContract();
      // let latestDurianId:number = NaN;
      // contract.on("DurianCreated", (durianId: any) => {
      //   console.log("durianID", durianId);
      //   latestDurianId = durianId;
      // });

      const durian = await contract.addDurian(
        farmID,
        treeID,
        varietyCode,
        harvestedTime,
        durianImg,
        conditionFarm
      );
      await durian.wait();
      console.log(durian);

    } catch (error) {
      setError('Something went wrong in adding durian');
      console.log('final error:', error);
      throw error;
    }
  };

  const checkTotalDurian = async () => {
    try {
      const contract = await connectSmartContract();

      const total:number = (await contract.checkTotalDurian()).toNumber();
      console.log(total);
      return total;
    } catch (error) {
      setError('Something went wrong in checking total durian');
    }
  };

  const getFarmId = async (farmAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const farmId = await contract.getFarmData(farmAddress);

      console.log('farmId', farmId);
      return farmId[0];
    } catch (error) {
      setError('Something went wrong in getting farm ID');
    }
  };

  //catalog.tsx
  const addDurianDCDetails = async (
    durianId: number,
    distributionCenterID: number,
    arrivalTimeDC: number,
    durianImg: String,
    conditionDC: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const catalog = await contract.addDurianDCDetails(
        durianId,
        distributionCenterID,
        arrivalTimeDC,
        durianImg,
        conditionDC
      );
      catalog.wait();
      console.log(catalog);
    } catch (error) {
      setError('Something went wrong in cataloging durian');
      throw error;
    }
  };

  const getDCId = async (DCAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const DCId = await contract.getDistributionCenterData(DCAddress);

      console.log('DCData', DCId);
      return DCId[0];
    } catch (error) {
      setError('Something went wrong in getting farm ID');
    }
  };

  //stock-in.tsx
  const addDurianRTDetails = async (
    durianId: number,
    retailerID: number,
    arrivalTimeRT: number,
    durianImg: String,
    conditionRT: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const stockIn = await contract.addDurianRTDetails(
        durianId,
        retailerID,
        arrivalTimeRT,
        durianImg,
        conditionRT
      );
      stockIn.wait();
      console.log(stockIn);
    } catch (error) {
      setError('Something went wrong in stocking in durian');
      throw error;
    }
  };

  const getRTId = async (RTAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const RTId = await contract.getRetailerData(RTAddress);

      console.log('RTData', RTId);
      return RTId[0];
    } catch (error) {
      setError('Something went wrong in getting farm ID');
    }
  };

  //sell.tsx
  const sellDurian = async (
    durianId: number,
    consumerID: number,
    soldTime: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const sell = await contract.sellDurian(durianId, consumerID, soldTime);
      sell.wait();
      console.log(sell);
    } catch (error) {
      setError('Something went wrong in selling durian');
    }
  };

  //rate.tsx
  const rateDurian = async (
    durianId: number,
    durianImg: String,
    taste: number,
    fragrance: number,
    creaminess: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const rate = await contract.rateDurian(
        durianId,
        durianImg,
        taste,
        fragrance,
        creaminess
      );
      rate.wait();
      console.log(rate);
    } catch (error) {
      setError('Something went wrong in rating durian');
      throw error;
    }
  };

  return (
    <DTraceContext.Provider
      value={{
        currentAccount,
        error,
        checkIfWalletIsConnected,
        connectWallet,
        isWalletConnected,
        uploadToIPFS,
        checkRatingStatus,
        checkAccountType,
        getContractOwner,
        getAdminList,
        getFarmDataList,
        getDistributionCenterDataList,
        getRetailerDataList,
        getConsumerDataList,
        addAdmin,
        addFarm,
        getFarmTotal,
        addDistributionCenter,
        getDistributionCenterTotal,
        addRetailer,
        getRetailerTotal,
        addConsumer,
        getConsumerTotal,
        checkTotalDurian,
        checkDurianDetails,
        addDurian,
        getFarmId,
        addDurianDCDetails,
        getDCId,
        addDurianRTDetails,
        getRTId,
        sellDurian,
        rateDurian,
      }}
    >
      {children}
    </DTraceContext.Provider>
  );
};

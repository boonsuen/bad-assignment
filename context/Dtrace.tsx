import React, { useState, useContext, createContext, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { Signer, ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';

// //Smart Contract
// //might move to constant.ts file
// Smart Contract Address and ABI
import dtrace from '../artifacts/contracts/DTrace.sol/DTrace.json';
const contractAddress = process.env.CONTRACT_ADDRESS as string;
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

const fetchContract = (signerOrProvider: any) => {
  return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
};

interface DTraceData {
  checkIfWalletIsConnected: () => Promise<boolean>;
  connectWallet: () => Promise<void>;
  uploadToIPFS: (file: any) => Promise<string | undefined>;
  isWalletConnected: boolean;
  currentAccount: string;
  error: string;
}

type DTraceContextProviderProps = {
  children: React.ReactNode;
};

// const defaultValue: DTraceData[] = [];
const defaultValue = {
  checkIfWalletIsConnected: () => {},
  connectWallet: () => {},
  uploadToIPFS: () => {},
  isWalletConnected: false,
  currentAccount: '',
  error: '',
} as unknown as DTraceData;

export const DTraceContext = React.createContext(defaultValue);
// export const DTraceContext = React.createContext<Partial<DTraceData>>([]);

export const DTraceProvider = ({ children }: DTraceContextProviderProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState('');

  //CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    console.log('check1');
    if (!window.ethereum) {
       setError('Please install MetaMask first.')
       return false;
    }
    console.log('check2');
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      setIsWalletConnected(true);
      return true;
    } else {
      setError('Connect with Metamask first.');
      return false;
    }
  };

  //CONNECT WALLET
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

  const connectSmartContract = async () => {
    //CONNECTING SMART CONTRACT
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    return fetchContract(signer);
  }

  //check account type
  const checkAccountType = async (accountAddress:String) => {
    try {
      const contract = await connectSmartContract();

      const accountType = await contract.checkAccountType(accountAddress);
      accountType.wait();
      console.log(accountType);
      return accountType;
    } catch(error) {
      setError("Something went wrong in checking account type");
    }
  }

  //add-account.tsx
  const addAdmin = async (adminAddress:String) => { 
    try {
      const contract = await connectSmartContract();

      const admin = await contract.addAdmin(adminAddress);
      admin.wait();
      console.log(admin);
    } catch (error) {
      setError("Something went wrong in adding admin");
    }
  };

  const addFarm = async (farmAddress:String, farmName:String, farmLocation: String) => {
    try {
      const contract = await connectSmartContract();

      const farm = await contract.addFarm(farmAddress, farmName, farmLocation);
      farm.wait();
      console.log(farm);
    } catch (error) {
      setError("Something went wrong in adding farm");
    }
  }

  const addDistributionCenter = async (distributionCenterAddress:String, distributionCenterName:String, distributionCenterLocation: String) => {
    try {
      const contract = await connectSmartContract();

      const distributionCenter = await contract.addDistributionCenter(distributionCenterAddress, distributionCenterName, distributionCenterLocation);
      distributionCenter.wait();
      console.log(distributionCenter);
    } catch (error) {
      setError("Something went wrong in adding distribution center");
    }
  }

  const addRetailer = async (retailerAddress:String, retailerName:String, retailerLocation: String) => {
    try {
      const contract = await connectSmartContract();

      const retailer = await contract.addRetailer(retailerAddress, retailerName, retailerLocation);
      retailer.wait();
      console.log(retailer);
    } catch (error) {
      setError("Something went wrong in adding retailer");
    }
  }

  //add-account.tsx, add-consumer.tsx
  const addConsumer = async (consumerAddress:String, consumerName:String) => {
    try {
      const contract = await connectSmartContract();

      const consumer = await contract.addConsumer(consumerAddress, consumerName);
      consumer.wait();
      console.log(consumer);
    } catch (error) {
      setError("Something went wrong in adding consumer");
    }
  }

  //check.tsx
  const checkTotalDurian = async () => {
    try {
      const contract = await connectSmartContract();

      const total = await contract.checkTotalDurian();
      console.log(total);
      return total;
    } catch (error) {
      setError("Something went wrong in checking total durian");
    }
  }

  const checkDurianDetails = async (durianId:number) => {
    try {
      const contract = await connectSmartContract();

      const status = await contract.checkDurianStatus(durianId);
      console.log(status);
      
      switch (status) {
        case 0: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          return { farmDetails };
        }
        case 1: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          return { farmDetails, DCDetails };
        }
        case 2: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          const RTDetails = await contract.checkDurianRTDetails(durianId);
          return { farmDetails, DCDetails, RTDetails };
        }
        case 3: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          const RTDetails = await contract.checkDurianRTDetails(durianId);
          const soldDetails = await contract.checkDurianSoldDetails(durianId);
          return { farmDetails, DCDetails, RTDetails, soldDetails };
        }
        case 4: {
          const farmDetails = await contract.checkDurianFarmDetails(durianId);
          const DCDetails = await contract.checkDurianDCDetails(durianId);
          const RTDetails = await contract.checkDurianRTDetails(durianId);
          const soldDetails = await contract.checkDurianSoldDetails(durianId);
          const ratingDetails = await contract.checkDurianRatingDetails(durianId);
          return { farmDetails, DCDetails, RTDetails, soldDetails, ratingDetails };
        }
        default:
          console.log("Durian not found");
          break;
      }
      
    } catch (error) {
      setError("Something went wrong in checking durian details");
    }
  }

  //add-durian.tsx
  const addDurian = async (
    farmID : number,
    treeID : number,
    varietyCode : String,
    harvestedTime : number,
    durianImg : String,
    conditionFarm : number
  ) => {
    try {
      const contract = await connectSmartContract();

      const durian = await contract.addDurian(farmID, treeID, varietyCode, harvestedTime, durianImg, conditionFarm);
      durian.wait();
      console.log(durian);
    } catch (error) {
      setError("Something went wrong in adding durian");
    }
  }

  //catalog.tsx
  const addDurianDCDetails = async (durianId:number, distributionCenterID:number, arrivalTimeDC:number, durianImg:String, conditionDC:number) => {
    try {
      const contract = await connectSmartContract();

      const catalog = await contract.addDurianDCDetails(
        durianId, 
        distributionCenterID, 
        arrivalTimeDC, 
        durianImg, 
        conditionDC);
      catalog.wait();
      console.log(catalog);
    } catch (error) {
      setError("Something went wrong in cataloging durian");
    }
  }

  //stock-in.tsx
  const addDurianRTDetails = async (durianId:number, retailerID:number, arrivalTimeRT:number, durianImg:String, conditionRT:number) => {
    try {
      const contract = await connectSmartContract();

      const stockIn = await contract.addDurianRTDetails(
        durianId, 
        retailerID, 
        arrivalTimeRT, 
        durianImg, 
        conditionRT);
      stockIn.wait();
      console.log(stockIn);
    } catch (error) {
      setError("Something went wrong in stocking in durian");
    }
  }

  //sell.tsx
  const sellDurian = async (durianId:number, consumerID:number, soldTime:number) => {
    try {
      const contract = await connectSmartContract();

      const sell = await contract.sellDurian(
        durianId, 
        consumerID, 
        soldTime);
      sell.wait();
      console.log(sell);
    } catch (error) {
      setError("Something went wrong in selling durian");
    }
  }

  //rate.tsx
  const rateDurian = async (durianId:number, durianImg:String, taste:number, fragrance:number, creaminess:number) => {
    try {
      const contract = await connectSmartContract();

      const rate = await contract.rateDurian(
        durianId, 
        durianImg, 
        taste, 
        fragrance, 
        creaminess);
      rate.wait();
      console.log(rate);
    } catch (error) {
      setError("Something went wrong in rating durian");
    }
  }


  return (
    <DTraceContext.Provider
      value={{
        currentAccount,
        error,
        checkIfWalletIsConnected,
        connectWallet,
        isWalletConnected,
        uploadToIPFS,
      }}
    >
      {children}
    </DTraceContext.Provider>
  );
};

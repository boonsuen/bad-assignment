import React, { useState, useContext, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

// //Smart Contract
// //might move to constant.ts file
// Smart Contract Address and ABI
import dtrace from "../artifacts/contracts/DTrace.sol/DTrace.json";
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = dtrace.abi;

//IPFS
const ipfsProjectId = process.env.IPFS_PROJECT_ID;
const ipfsProjectSecretKey = process.env.IPFS_PROJECT_SECRET_KEY;

const authorization = "Basic " + btoa(ipfsProjectId + ":" + ipfsProjectSecretKey);
const subdomain = process.env.IPFS_SUBDOMAIN;

const client = ipfsHttpClient({
    host: "infura-ipfs.io",
    // port: "5001",
    port: 5001,
    protocol: "https",
    headers: {
      authorization,
    },
});

// const fetchContract = (signerOrProvider) =>
//   new ethers.Contract(contractAdress, contractABI, signerOrProvider);
interface DTraceData {
    // Define the properties of your trace data here
    checkIfWalletIsConnected: () => Promise<void>;
    connectWallet: () => Promise<void>; 
    uploadToIPFS: (file: any) => Promise<string | undefined>; 
    isWalletConnected: boolean;
    currentAccount: string;
    error : string;

}

type DTraceContextProviderProps = {
    children: React.ReactNode;
};

// const defaultValue: DTraceData[] = [];
const defaultValue = {
  checkIfWalletIsConnected: () => { },
  connectWallet: () => { },
  uploadToIPFS: () => { },
  isWalletConnected: false,
  currentAccount: "",
  error: "",
} as unknown as DTraceData;

export const DTraceContext = React.createContext(defaultValue);
// export const DTraceContext = React.createContext<Partial<DTraceData>>([]);

export const DTraceProvider = ({ children } : DTraceContextProviderProps) => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [currentAccount, setCurrentAccount] = useState("");
    const [error, setError] = useState("");

    //CONNECTING METAMASK
    const checkIfWalletIsConnected = async () => {
      console.log("check1");
      if (!window.ethereum) return setError("Please install MetaMask first.");
      console.log("check2");
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        setIsWalletConnected(true);
      } else {
        setError("Connect with Metamask first.");
      }
    };
  
    //CONNECT WALLET
    const connectWallet = async () => {
      console.log("connectWallet");
      if (!window.ethereum) return setError("Please install MetaMask first.");
      
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
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
        setError("Error uploading file to IPFS");
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
          }}
        >
          {children}
        </DTraceContext.Provider>
      );
};

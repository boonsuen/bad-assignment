// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

// const config: HardhatUserConfig = {
//   solidity: "0.8.18",
// };

// export default config;

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    localganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        `0x${process.env.OWNER_PRIVATE_KEY}`,
      ],
    },
    hardhat: {
      chainId: 1337,
    },
  },
};
// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

// const config: HardhatUserConfig = {
//   solidity: "0.8.18",
// };
// const { network } = require('hardhat');
// const { config } = require('dotenv');
// const { resolve } = require('path');
// const { task } = require('hardhat/config');
// const { deploy } = require('../scripts/deploy.js');
// require('ts-node/register');

// config({ path: resolve(__dirname, '../.env.local') });

// task('deploy', 'Deploy the contracts').setAction(async () => {
//    await deploy(network.name);
// });

// (async () => {
//    try {
//       await task('deploy').start();
//    } catch (e) {
//       console.error(e);
//       process.exit(1);
//    }
// })();


// export default config;
// const { network } = require('hardhat');
// import { config } from "dotenv";
// import { resolve } from "path";
require('dotenv').config({path: __dirname + '/.env.local'})
// const { resolve } = require('path');
// require('dotenv').config({ path: resolve(__dirname, './.env.local') });
require("@nomicfoundation/hardhat-toolbox");
// require('dotenv').config({ path: require('find-config')('.env.local') })

// config({ path: resolve(__dirname, "../.env.local") })

module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: { //localhost
      chainId: 1337,
    },
    localganache: {
      // url: "HTTP://127.0.0.1:7545",
      url: process.env.GANACHE_PROVIDER_URL,
      accounts: [
        `0x${process.env.OWNER_PRIVATE_KEY}`,
      ],
    },
  },
};
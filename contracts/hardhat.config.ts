import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";

dotenv.config();

import './tasks/deploy'

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    celoTestnet: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
    celoMainnet: {
      url: "https://forno.celo.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
  },
};

export default config;

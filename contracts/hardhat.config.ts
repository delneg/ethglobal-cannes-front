import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    celo: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [""],
    },
  },
};

export default config;

import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import {hashEndpointWithScope} from './utils/scopeGenerator';
import {calculateContractAddress} from "./utils/calculateContractAddress";
import {createPublicClient, http} from "viem";
import {celoAlfajores} from "viem/chains";

describe("Sample Account", function () {
  describe("Deployment", function () {
    it('Deploy', async () => {
      // Calculate contract address
      const [signer] = await hre.ethers.getSigners();
      const calculatedContractAddress = await calculateContractAddress(signer.address as `0x${string}`)

      // Calculate scope
      const scopeSeed = "my-app-dev"
      const scope = hashEndpointWithScope(calculatedContractAddress, scopeSeed)

      console.log('Scope: ', scope)

      // Deploy contract
      const contract = await hre.ethers.getContractFactory("SelfProtocolAccount");
      const tx = await contract.deploy();
      const instance = await tx.waitForDeployment();
      const contractAddress = await instance.getAddress();
      console.log('Deployed to: ', contractAddress);
    })
  });
});

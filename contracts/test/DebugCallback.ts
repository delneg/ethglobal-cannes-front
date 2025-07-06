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

describe("ExampleV2", function () {
  describe("Deployment", function () {
    it('Deploy', async () => {
      // Calculate contract address
      const [signer] = await hre.ethers.getSigners();
      const calculatedContractAddress = await calculateContractAddress(signer.address as `0x${string}`)
      console.log('DEBUG CALCULATED: ', calculatedContractAddress)

      // Calculate scope
      const scopeSeed = "my-app-dev"
      const scope = hashEndpointWithScope(calculatedContractAddress, scopeSeed)

      // Deploy contract
      const contract = await hre.ethers.getContractFactory("DebugCallback");
      const tx = await contract.deploy(scope);
      const instance = await tx.waitForDeployment()
      const contractAddress = await instance.getAddress();
      console.log('Deployed to: ', contractAddress)
    })
  });
});

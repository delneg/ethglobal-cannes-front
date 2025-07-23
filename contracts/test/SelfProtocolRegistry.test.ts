import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseAbi, encodePacked, keccak256, parseEther } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

describe("SelfProtocolRegistry", function () {
  let publicClient: any;
  let walletClients: any[];
  let testClient: any;
  let contractAddress: `0x${string}`;

  // Test accounts
  let deployer: any;
  let user1: any;
  let user2: any;
  let recoveryAccount: any;

  const contractAbi = parseAbi([
    "function registerRecovery(address recoveryAddress, bytes memory signature) external",
    "function cleanupRecovery(bytes memory signature) external",
    "function getRecoveryAddress(address user) external view returns (address)",
    "event RecoveryRegistered(address indexed user, address indexed recoveryAddress)",
    "event RecoveryCleanedUp(address indexed user)",
    "error InvalidSignature()",
    "error ZeroAddress()",
    "error NoRecoveryAddressSet()"
  ]);

  beforeEach(async function () {
    // Get clients
    publicClient = await hre.viem.getPublicClient();
    walletClients = await hre.viem.getWalletClients();
    testClient = await hre.viem.getTestClient();

    // Use the first 4 hardhat accounts
    deployer = walletClients[0].account;
    user1 = walletClients[1].account;
    user2 = walletClients[2].account;
    recoveryAccount = walletClients[3].account;

    // Deploy contract using Hardhat's deployment system
    const deployedContract = await hre.viem.deployContract("SelfProtocolRegistry");
    contractAddress = deployedContract.address;
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe("registerRecovery", function () {
    it("Should register recovery address with valid signature", async function () {
      // Create message hash for recovery address
      const messageHash = keccak256(encodePacked(["address"], [recoveryAccount.address]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      // Register recovery using user1's wallet client
      const hash = await walletClients[1].writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "registerRecovery",
        args: [recoveryAccount.address, signature],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // Verify recovery address is set
      const recoveryAddress = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getRecoveryAddress",
        args: [user1.address],
      });

      expect(recoveryAddress).to.equal(getAddress(recoveryAccount.address));
    });

    it("Should emit RecoveryRegistered event", async function () {
      const messageHash = keccak256(encodePacked(["address"], [recoveryAccount.address]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      const hash = await walletClients[1].writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "registerRecovery",
        args: [recoveryAccount.address, signature],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Check for RecoveryRegistered event
      const logs = await publicClient.getLogs({
        address: contractAddress,
        event: {
          type: "event",
          name: "RecoveryRegistered",
          inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "recoveryAddress", type: "address", indexed: true }
          ]
        },
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber,
      });

      expect(logs).to.have.length(1);
      expect(logs[0].args.user).to.equal(getAddress(user1.address));
      expect(logs[0].args.recoveryAddress).to.equal(getAddress(recoveryAccount.address));
    });

    it("Should revert with InvalidSignature for wrong signer", async function () {
      const messageHash = keccak256(encodePacked(["address"], [recoveryAccount.address]));
      // Sign with user2 instead of user1
      const signature = await walletClients[2].signMessage({ message: { raw: messageHash } });

      await expect(
        walletClients[1].writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "registerRecovery",
          args: [recoveryAccount.address, signature],
        })
      ).to.be.rejected;
    });

    it("Should revert with ZeroAddress for zero recovery address", async function () {
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      const messageHash = keccak256(encodePacked(["address"], [zeroAddress]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      await expect(
        walletClients[1].writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "registerRecovery",
          args: [zeroAddress, signature],
        })
      ).to.be.rejected;
    });
  });

  describe("cleanupRecovery", function () {
    beforeEach(async function () {
      // Set up a recovery address first
      const messageHash = keccak256(encodePacked(["address"], [recoveryAccount.address]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      const hash = await walletClients[1].writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "registerRecovery",
        args: [recoveryAccount.address, signature],
      });

      await publicClient.waitForTransactionReceipt({ hash });
    });

    it("Should cleanup recovery address with valid signature", async function () {
      // Create message hash for user's own address
      const messageHash = keccak256(encodePacked(["address"], [user1.address]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      const hash = await walletClients[1].writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "cleanupRecovery",
        args: [signature],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // Verify recovery address is cleared
      const recoveryAddress = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getRecoveryAddress",
        args: [user1.address],
      });

      expect(recoveryAddress).to.equal("0x0000000000000000000000000000000000000000");
    });

    it("Should emit RecoveryCleanedUp event", async function () {
      const messageHash = keccak256(encodePacked(["address"], [user1.address]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      const hash = await walletClients[1].writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "cleanupRecovery",
        args: [signature],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Check for RecoveryCleanedUp event
      const logs = await publicClient.getLogs({
        address: contractAddress,
        event: {
          type: "event",
          name: "RecoveryCleanedUp",
          inputs: [
            { name: "user", type: "address", indexed: true }
          ]
        },
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber,
      });

      expect(logs).to.have.length(1);
      expect(logs[0].args.user).to.equal(getAddress(user1.address));
    });

    it("Should revert with InvalidSignature for wrong signer", async function () {
      const messageHash = keccak256(encodePacked(["address"], [user1.address]));
      // Sign with user2 instead of user1
      const signature = await walletClients[2].signMessage({ message: { raw: messageHash } });

      await expect(
        walletClients[1].writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "cleanupRecovery",
          args: [signature],
        })
      ).to.be.rejected;
    });

    it("Should revert with NoRecoveryAddressSet when no recovery address is set", async function () {
      // First cleanup the existing recovery address
      const messageHash = keccak256(encodePacked(["address"], [user1.address]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      let hash = await walletClients[1].writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "cleanupRecovery",
        args: [signature],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // Try to cleanup again - should fail
      await expect(
        walletClients[1].writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "cleanupRecovery",
          args: [signature],
        })
      ).to.be.rejected;
    });
  });

  describe("getRecoveryAddress", function () {
    it("Should return zero address for unset recovery", async function () {
      const recoveryAddress = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getRecoveryAddress",
        args: [user1.address],
      });

      expect(recoveryAddress).to.equal("0x0000000000000000000000000000000000000000");
    });

    it("Should return correct recovery address after registration", async function () {
      // Register recovery
      const messageHash = keccak256(encodePacked(["address"], [recoveryAccount.address]));
      const signature = await walletClients[1].signMessage({ message: { raw: messageHash } });

      const hash = await walletClients[1].writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "registerRecovery",
        args: [recoveryAccount.address, signature],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // Check recovery address
      const recoveryAddress = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getRecoveryAddress",
        args: [user1.address],
      });

      expect(recoveryAddress).to.equal(getAddress(recoveryAccount.address));
    });
  });
});

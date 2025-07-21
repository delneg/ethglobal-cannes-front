import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {calculateContractAddress, hashEndpointWithScope} from "./scopeUtils";

task("deploy", "Deploy SelfProtocolAccount contract")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        // Calculate contract address to be deployed
        const [walletClient] = await hre.viem.getWalletClients()
        const scopeSeed = "my-app-dev"
        const calculatedContractAddress = await calculateContractAddress(walletClient.account.address)
        console.log("Calculated contract address", calculatedContractAddress)
        const scope = hashEndpointWithScope(calculatedContractAddress, scopeSeed)
        console.log("Scope", scope)

        // Get the contract factory
        const contract = await hre.viem.deployContract("SelfProtocolAccount", [
            BigInt(scope)
        ]);

        console.log("Deployed contract address:", contract.address);

        return {
            address: contract.address,
        };
    });


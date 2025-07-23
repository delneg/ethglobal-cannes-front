import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";

task("deploy-registry", "Deploy SelfProtocolAccount contract")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        // Get the contract factory
        const contract = await hre.viem.deployContract("SelfProtocolRegistry");
        console.log("Deployed registry contract address:", contract.address);

        return {
            address: contract.address,
        };
    });


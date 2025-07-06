import {createPublicClient, getContractAddress, http} from 'viem'
import {celoAlfajores} from "viem/chains";

export const calculateContractAddress = async (deployerAddress: `0x${string}`) => {
    const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
    })

    // Get current nonce
    const nonce = await publicClient.getTransactionCount({
        address: deployerAddress
    })

    // Calculate next contract address
    const contractAddress = getContractAddress({
        from: deployerAddress,
        nonce: BigInt(nonce)
    })

    return contractAddress
}
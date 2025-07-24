import {
    Address,
    createPublicClient,
    getContractAddress,
    http,
    parseAbi,
    SignAuthorizationReturnType,
    WalletClient
} from "viem";
import {celoAlfajores} from "viem/chains";
import {hashEndpointWithScope} from "./scopeGenerator.ts";


export const EXPLORER_URL = "https://alfajores.celoscan.io"

export function getExplorerUrl(tx: string) {
    return `${EXPLORER_URL}/tx/${tx}`
}

export const IMPLEMENTATION_ABI = parseAbi([
    "function initialize(uint256 scope, bool isProduction) public",
    "function isInitialized() public view returns (bool)",
    "function recover(address to, uint256 value, bytes calldata data) external",
    "function wrapper() public view returns (address)",
    "function enableRecoveryMode() public"
])

export const WRAPPER_ABI = parseAbi([
    "function allowedSigner() public view returns (address)",
    "function getMasterNullifier() public view returns (uint256)"
])

export const IMPLEMENTATION_ADDRESS = import.meta.env.VITE_IMPLEMENTATION_ADDRESS
export const SCOPE_SEED = "my-app-dev"
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
        nonce: BigInt(nonce + 1)
    })

    return contractAddress
}

// export async function getOmnichainAuthorization(user: PrivateKeyAccount) {
//   const authorization = await user.signAuthorization({
//     contractAddress: IMPLEMENTATION_ADDRESS as any,
//     chainId: 0,
//     nonce: 0
//   })
//   return authorization;
// }

export async function isAllowedSigner(userAddress: Address, signerAddress: Address) {
    const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
    })
    try {
        const wrapperAddress = await getRecoveryWrapperAddress(userAddress);
        console.log('wrapperAddress: ', wrapperAddress)
        const allowedSigner =await publicClient.readContract({
            abi: WRAPPER_ABI,
            functionName: 'allowedSigner',
            args: [],
            address: wrapperAddress,
        });
        console.log('allowedSigner: ', allowedSigner)
        return allowedSigner.toLowerCase() == signerAddress.toLowerCase();
    } catch (e) {
        console.log('Error checking isAllowedSigner: ', e)
        return false;
    }
}

export async function isInitialized(userAddress: string) {
    const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
    })
    try {
        return await publicClient.readContract({
            abi: IMPLEMENTATION_ABI,
            functionName: 'isInitialized',
            args: [],
            address: userAddress as Address,
        });
    } catch (e) {
        console.log('Error checking isInitialized: ', e)
        return false;
    }
}

export async function getMasterNullifier(userAddress: string) {
    const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
    })
    try {
        const wrapperAddress = await publicClient.readContract({
            abi: IMPLEMENTATION_ABI,
            functionName: 'wrapper',
            args: [],
            address: userAddress as Address,
        });

        return await publicClient.readContract({
            abi: WRAPPER_ABI,
            functionName: 'getMasterNullifier',
            args: [],
            address: wrapperAddress as Address,
        });
    } catch (e) {
        console.log('Error checking isInitialized: ', e)
        return 0n;
    }
}

// export async function getRecoveryWrapperAddress(userAddress: Address) {
//   const publicClient = createPublicClient({
//     chain: celoAlfajores,
//     transport: http()
//   })
//
//   try {
//     return await publicClient.readContract({
//       abi: REGISTRY_ABI,
//       functionName: 'getRecoveryAddress',
//       args: [userAddress],
//       address: REGISTRY_ADDRESS as Address,
//     });
//   } catch (e) {
//     console.log('Error checking isInitialized: ', e)
//     return zeroAddress;
//   }
// }

// export async function dropAuth(walletClient: WalletClient, userAddress: string, authorization: SignAuthorizationReturnType) {
//   const hash = await walletClient.sendTransaction({
//     to: zeroAddress,
//     value: 0n,
//     authorizationList: [authorization]
//   } as any)
//   console.log('Drop auth tx hash: ', hash)
//
//   const publicClient = createPublicClient({
//     chain: celoAlfajores,
//     transport: http()
//   })
//
//   await publicClient.waitForTransactionReceipt({
//     hash
//   })
//
//   return hash;
// }

export async function initializeAccount(walletClient: WalletClient, userAddress: string, authorization: SignAuthorizationReturnType) {
    // const isAccountInitialized = await isInitialized(userAddress)
    // if (isAccountInitialized) {
    //   console.log('Account already initialized')
    //   return zeroHash;
    // }

    const contractAddress = await calculateContractAddress(userAddress as any)
    console.log('Predicted contract address: ', contractAddress)
    const scope = BigInt(hashEndpointWithScope(contractAddress, SCOPE_SEED))

    // Initialize account
    const hash = await walletClient.writeContract({
        abi: IMPLEMENTATION_ABI,
        address: userAddress as any,
        authorizationList: [authorization],
        functionName: 'initialize',
        args: [scope, false],
        chain: celoAlfajores
    } as any)
    console.log('Transaction hash:', hash)

    const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
    })

    await publicClient.waitForTransactionReceipt({
        hash
    })

    const isProperlyInitialized = await isInitialized(userAddress)
    console.log('Is initialized correctly: ', isProperlyInitialized)

    return hash;
}

export async function initializeRecoveryMode(walletClient: WalletClient, userAddress: string, beneficiaryAddress: string) {
    const initiateRecoveryTxHash = await walletClient.writeContract({
        abi: IMPLEMENTATION_ABI,
        address: userAddress as any,
        functionName: "enableRecoveryMode",
        args: []
    } as any)
    console.log('Recovery proposed: ', initiateRecoveryTxHash)
    return initiateRecoveryTxHash
}

export async function recoverTestTx(walletClient: WalletClient, userAddress: string, beneficiaryAddress: string) {
    const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
    })
    const pendingBalance = await publicClient.getBalance({
        address: userAddress as any,
    })

    console.log('Pending balance: ', pendingBalance);
    const hash = await walletClient.writeContract({
        abi: IMPLEMENTATION_ABI,
        address: userAddress as any,
        functionName: 'recover',
        args: [beneficiaryAddress as any, pendingBalance, "0x"],
    } as any)
    console.log('Dummy tx. Should transfer 1 wei:', hash)
    return hash
}

export async function getRecoveryWrapperAddress(userAddress: string) {
    const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
    })
    return await publicClient.readContract({
        abi: IMPLEMENTATION_ABI,
        functionName: 'wrapper',
        args: [],
        address: userAddress as any,
    });
}


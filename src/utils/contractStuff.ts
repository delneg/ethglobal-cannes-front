import {Account, createPublicClient, getContractAddress, http, parseAbi, PrivateKeyAccount, SignAuthorizationReturnType, WalletClient} from "viem";
import { celoAlfajores } from "viem/chains";
import {hashEndpointWithScope} from "./scopeGenerator.ts";

export const IMPLEMENTATION_ABI = parseAbi([
  "function initialize(uint256 scope)",
  "function isInitialized() public view returns (bool)",
  "function recover(address to, uint256 value, bytes calldata data) external",
  "function wrapper() public view returns (address)",
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
    nonce: BigInt(nonce)
  })

  return contractAddress
}

export async function getOmnichainAuthorization(user: PrivateKeyAccount) {
  const authorization = await user.signAuthorization({
    contractAddress: IMPLEMENTATION_ADDRESS as any,
    chainId: 0,
    nonce: 0
  })
  return authorization;
}
export async function initializeAccount(walletClient: WalletClient, userAddress: string, authorization: SignAuthorizationReturnType) {
  const contractAddress = await calculateContractAddress(userAddress as any)
  console.log('Predicted contract address: ', contractAddress )
  const scope = BigInt(hashEndpointWithScope(contractAddress, SCOPE_SEED))


  // Initialize account
  const hash = await walletClient.writeContract({
    abi: IMPLEMENTATION_ABI,
    address: userAddress as any,
    authorizationList: [authorization],
    functionName: 'initialize',
    args: [scope],
    // chain: celoAlfajores
  } as any)
  console.log('Transaction hash:', hash)
  return hash;
}

export async function dummyTestTx(walletClient: WalletClient, userAddress: string, beneficiaryAddress: string) {
  const hash = await walletClient.writeContract({
    abi: IMPLEMENTATION_ABI,
    address: userAddress as any,
    functionName: 'recover',
    args: [beneficiaryAddress as any, BigInt(1), "0x"],
  } as any)
  console.log('Dummy tx. Should transfer 1 wei:', hash)
  return hash
}

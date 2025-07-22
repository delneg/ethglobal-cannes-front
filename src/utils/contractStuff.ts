import {
  createPublicClient,
  getContractAddress,
  http,
  parseAbi,
  PrivateKeyAccount,
  SignAuthorizationReturnType,
  WalletClient, zeroHash
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
  "function proposeRecovery(address _newSigner) public"
])

export const IS_MAINNET = import.meta.env.VITE_IS_PRODUCTION
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
    nonce: BigInt(nonce+1)
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
      address: userAddress as any,
    });
  } catch (e) {
    console.log('Error checking isInitialized: ', e)
    return false;
  }
}

export async function initializeAccount(walletClient: WalletClient, userAddress: string, authorization: SignAuthorizationReturnType) {
  const isAccountInitialized = await isInitialized(userAddress)
  if (isAccountInitialized) {
    console.log('Account already initialized')
    return zeroHash;
  }

  const contractAddress = await calculateContractAddress(userAddress as any)
  console.log('Predicted contract address: ', contractAddress )
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

  // Wait a bit, while transaction being settled
  await new Promise((r) => setTimeout(r, 5000))

  const isProperlyInitialized = await isInitialized(userAddress)
  console.log('Is initialized correctly: ', isProperlyInitialized)

  return hash;
}

export async function initializeRecoveryMode(walletClient: WalletClient, userAddress: string, beneficiaryAddress: string) {
  const initiateRecoveryTxHash = await walletClient.writeContract({
    abi: IMPLEMENTATION_ABI,
    address: userAddress as any,
    functionName: "proposeRecovery",
    args: [beneficiaryAddress as any]
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

export async function getSmartAccountImplementationAddress(userAddress: string) {
  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http()
  })
  console.log('userAddress in get SOA: ', userAddress)
  const value = await publicClient.readContract({
    abi: IMPLEMENTATION_ABI,
    functionName: 'wrapper',
    args: [],
    address: userAddress as any,
  })
  console.log('current wrapper: ', value)

  return value;
}


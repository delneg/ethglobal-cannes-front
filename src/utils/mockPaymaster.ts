import {createWalletClient, http} from "viem";
import {celoAlfajores} from "viem/chains";
import {privateKeyToAccount} from "viem/accounts";

const beneficiaryPK = import.meta.env.VITE_PK_BENEFICIARY;

export function getMockedPaymasterWalletClient(){
  const walletClient = createWalletClient({
    account: privateKeyToAccount(beneficiaryPK),
    chain: celoAlfajores,
    transport: http(),
  });
  return walletClient;
}

import {createWalletClient, http} from "viem";
import {celo} from "viem/chains";
import {privateKeyToAccount} from "viem/accounts";

const beneficiaryPK = import.meta.env.VITE_PK_BENEFICIARY;

export function getMockedPaymasterWalletClient(){
  const walletClient = createWalletClient({
    account: privateKeyToAccount(beneficiaryPK),
    chain: celo,
    transport: http(),
  });
  return walletClient;
}

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {PrivyProvider, PrivyClientConfig} from "@privy-io/react-auth";
import {celoAlfajores} from "viem/chains";
import {ClientContextProvider} from "./context/ClientContext.tsx";


export const config: PrivyClientConfig = {
  // Display email and wallet as login methods
  // loginMethods: ['email', 'wallet'],
  // Customize Privy's appearance in your app
  appearance: {
    // walletChainType: "ethereum-only",
    landingHeader: "Revix: Recover your wallet"
  },
  // walletConnectCloudProjectId: config.walletConnectProjectId,

  // Create embedded wallets for users who don't have a wallet
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    showWalletUIs: true,
    // extendedCalldataDecoding: true,
    // createOnLogin: 'off', // Anything other than 'off' will not be honored with whitelabel Auth. You must use createWallet from usePrivy()
    // showWalletUIs: false,
  },
  defaultChain: celoAlfajores,
  supportedChains: [celoAlfajores],
  captchaEnabled: false
}


createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <PrivyProvider
        appId="cmcq0midl00vpl50n6xef1fqs"
        clientId={'client-WY6N5YFNGZ5FV4BMmp1krG5b4iqggT7SURWQM6Ccbm5jw'}
        config={config}
      >
        <ClientContextProvider>
          <Root/>
        </ClientContextProvider>
      </PrivyProvider>
    </StrictMode>
)

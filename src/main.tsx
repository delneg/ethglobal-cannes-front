import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {PrivyProvider} from "@privy-io/react-auth";
import {celoAlfajores} from "viem/chains";


export const config = {
  // Display email and wallet as login methods
  // loginMethods: ['email', 'wallet'],
  // Customize Privy's appearance in your app
  appearance: {
    theme: 'light',
    accentColor: '#0076EF',
    walletChainType: "ethereum-only",
    landingHeader: "ETHGlobal cannes 2025"
  },
  // walletConnectCloudProjectId: config.walletConnectProjectId,

  // Create embedded wallets for users who don't have a wallet
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    showWalletUIs: true,
    extendedCalldataDecoding: true,
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
        clientId="WY6N5YFNGZ5FV4BMmp1krG5b4iqggT7SURWQM6Ccbm5jw"
        config={config}
      >
        <App/>
      </PrivyProvider>
    </StrictMode>
)

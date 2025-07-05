import React, {createContext, PropsWithChildren, useContext, useState} from "react";
import {EIP1193Provider} from "viem";


export interface ClientContextType {
  userAddress: string;
  setUserAddress: React.Dispatch<React.SetStateAction<string>>;
  eip1193Provider: any;
  setEip1193Provider: React.Dispatch<React.SetStateAction<any>>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);
export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientContextProvider');
  }
  return context;
};

export const ClientContextProvider: React.FC<PropsWithChildren> = ({children}) => {

  const [userAddress, setUserAddress] = useState<string>("");

  const [eip1193Provider, setEip1193Provider] = useState<EIP1193Provider | undefined>(undefined);

  return (
    <ClientContext.Provider value={{
      userAddress, setUserAddress, eip1193Provider, setEip1193Provider,
    }}>
      {children}
    </ClientContext.Provider>
  );
}

import {QueryClient} from "@tanstack/react-query";
import {createSyncStoragePersister} from "@tanstack/query-sync-storage-persister";
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import React from "react";
import App from "./App.tsx";


const Root = () => {
  const debug = import.meta.env.DEV;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: debug ? 50 : 1000 * 5, // 50 ms or 5 minutes
      },
    },
  })
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  })

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{persister}}
    >
      <App/>
    </PersistQueryClientProvider>
  )
}

export default Root;

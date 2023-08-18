import React, {createContext, useState, useEffect, useContext} from 'react';
import NetInfo from '@react-native-community/netinfo';

type NetworkContextType = {
  isConnected: boolean;
  onReconnect: () => Promise<void>;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const [isConnected, setIsConnected] = useState(false);
  const onReconnect = async () => {
    await NetInfo.fetch().then(state => {
      setIsConnected(!!state.isConnected);
    });
  };

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    // Fetch the current network state once
    NetInfo.fetch().then(state => {
      setIsConnected(!!state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{isConnected, onReconnect}}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

import React from 'react';
import { historyPoint } from '../datasource/HistoryPointDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Context {
  currentPoint: number;
  getCurrentPoint: () => Promise<void>;
}
interface Props {
  children: React.ReactNode;
}
const PointContext = React.createContext<Context>({
  currentPoint: 0,
  getCurrentPoint: async () => {},
});

export const PointProvider: React.FC<Props> = ({ children }) => {
  const [currentPoint, setCurrentPoint] = React.useState<number>(0);

  const getCurrentPoint = async () => {
    try {
      const farmerId = (await AsyncStorage.getItem('farmer_id')) || '';
      if (!farmerId) {
        return;
      }
      const result = await historyPoint.getPoint(farmerId);
      setCurrentPoint(result.balance);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PointContext.Provider
      value={{
        currentPoint,
        getCurrentPoint,
      }}>
      {children}
    </PointContext.Provider>
  );
};

export const usePoint = (): Context => React.useContext(PointContext);

import React, { useEffect } from 'react';
import { getHighlight } from '../datasource/PromotionDatasource';
import ModalHighlight from '../components/ModalHighlight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

interface HighlightResponse {
  id: string;
  name: string;
  status: string;
  imagePath: string;
  urlNews: string;
  read: number;
  application: string;
  startDate: string;
  endDate: string;
  createAt: string;
  updateAt: string;
  createBy: string;
  updateBy: string;
}
interface StateHighlight {
  visible: boolean;
  uriImage: string;
  uriNavigation: string;
  isActive: boolean;
  id: string;
}

const timeClose = {
  day: 1,
  hour: 5,
  minute: 0,
};
interface HighlightContextType {
  highlightModal: StateHighlight;
  setHighlightModal: React.Dispatch<React.SetStateAction<StateHighlight>>;
  onShow: () => void;
  onClose: () => void;
  onCloseOneDay: () => void;
  isHighlightClosed: boolean;
}
const HighlightContext = React.createContext<HighlightContextType>({
  highlightModal: {
    visible: false,
    uriImage: '',
    uriNavigation: '',
    isActive: false,
    id: '',
  },
  isHighlightClosed: false,
  setHighlightModal: () => {},
  onShow: () => {},
  onClose: () => {},
  onCloseOneDay: () => {},
});
export const HighlightProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [highlightModal, setHighlightModal] = React.useState<StateHighlight>({
    visible: false,
    uriImage: '',
    uriNavigation: '',
    isActive: false,
    id: '',
  });
  const [isAlreadyShowOnce, setIsAlreadyShowOnce] = React.useState(false);
  const [isHighlightClosed, setIsHighlightClosed] = React.useState(false);
  const getHighlightInitial = async () => {
    try {
      const result: HighlightResponse = await getHighlight({
        application: 'FARMER',
      });
      if (result?.status === 'INACTIVE') {
        setHighlightModal(prev => ({ ...prev, isActive: false }));
        setIsHighlightClosed(true);
        return;
      }
      setHighlightModal({
        visible: false,
        uriImage: result.imagePath,
        uriNavigation: result.urlNews,
        isActive: true,
        id: result.id,
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  const onClose = () => {
    setHighlightModal(prev => ({ ...prev, visible: false }));
  };
  const onShow = async () => {
    const closedHighlightDate = await AsyncStorage.getItem('closedHighlight');
    const isAfter = closedHighlightDate
      ? moment().isAfter(closedHighlightDate)
      : true;
    if (!isAfter) {
      return;
    }
    if (isAlreadyShowOnce) {
      return;
    }

    setHighlightModal(prev => ({ ...prev, visible: true }));
    setIsAlreadyShowOnce(true);
  };

  const onCloseOneDay = async () => {
    try {
      await AsyncStorage.setItem(
        'closedHighlight',
        moment()
          .add(timeClose.day, 'day')
          .set('hours', timeClose.hour)
          .set('minute', timeClose.minute)
          .toISOString(),
      );
      setIsAlreadyShowOnce(true);
      await onClose();
      setTimeout(() => {
        setIsHighlightClosed(true);
      }, 1000);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getHighlightInitial();
  }, []);

  return (
    <HighlightContext.Provider
      value={{
        highlightModal,
        setHighlightModal,
        onClose: async () => {
          await onClose(); // setDelayClose(true);
          setTimeout(() => {
            setIsHighlightClosed(true);
          }, 1000);
        },
        onShow,
        onCloseOneDay,
        isHighlightClosed: isHighlightClosed || isAlreadyShowOnce,
      }}>
      {children}
      <ModalHighlight />
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => React.useContext(HighlightContext);

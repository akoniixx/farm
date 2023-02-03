import React from 'react';
import { View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import HistoryDronerUsed from '../../navigations/TopTabs/HistoryDronerUsed';
import { stylesCentral } from '../../styles/StylesCentral';

const DronerUsedScreen: React.FC<any> = ({ navigation }) => {
  return (
    <>
      <View style={stylesCentral.container}>
        <CustomHeader title="ประวัติการจ้างนักบิน"  showBackBtn
          onPressBack={() => navigation.goBack()}/>
        <HistoryDronerUsed />
      </View>
    </>
  );
};

export default DronerUsedScreen;

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import { stylesCentral } from '../../styles/StylesCentral';

const AllPlotScreen: React.FC<any> = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="แปลงของคุณ"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
      </SafeAreaView>
    </>
  );
};
export default AllPlotScreen;

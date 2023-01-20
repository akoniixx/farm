import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import { Text } from 'react-native';

const EditFarmerPlot: React.FC<any> = ({ route, navigation }) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    plotIndex();
  }, []);
  const plotIndex = async () => {
    const Index = await AsyncStorage.getItem('plotIndex');
    setData(Index);
  };
  return (
    <SafeAreaView>
      <CustomHeader
        title="รายละเอียดแปลง"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View>
        <Text></Text>
      </View>
    </SafeAreaView>
  );
};
export default EditFarmerPlot;

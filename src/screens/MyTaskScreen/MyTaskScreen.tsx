import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import MyTaskTapNavigator from '../../navigations/TopTabs/MytaskTabNavigator';
import { stylesCentral } from '../../styles/StylesCentral';

const TaskScreen: React.FC<any> = ({ navigation }) => {
  return (
    <>
      <View style={stylesCentral.container}>
        <CustomHeader title="งานของฉัน" />
        <MyTaskTapNavigator />
      </View>
    </>
  );
};

export default TaskScreen;

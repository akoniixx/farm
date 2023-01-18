import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import { stylesCentral } from '../../styles/StylesCentral';

const TaskScreen: React.FC<any> = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader title="งานของฉัน" />
      </SafeAreaView>
    </>
  );
};

export default TaskScreen;

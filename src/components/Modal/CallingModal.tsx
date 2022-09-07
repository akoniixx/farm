import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {normalize} from '@rneui/themed';
import {MainButton} from '../Button/MainButton';
import {colors} from '../../assets';
import { dialCall } from '../../function/utility';

interface CallingModalProps {
  tel: string;
}
export const CallingModal: React.FC<CallingModalProps> = ({tel}) => {
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text>โทรศัพย์หา</Text>
      </View>
      <MainButton
        label={'เกษตรกร'}
        color={colors.orange}
        onPress={() => dialCall(tel)}
      />
      <MainButton
        label={'ติดต่อเจ้าหน้าที่'}
        color={colors.white}
        fontColor={'red'}
        borderColor={colors.disable}
        onPress={() => dialCall()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(15),
  },
});

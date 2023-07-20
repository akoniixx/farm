import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import Text from '../Text';
import {font, image} from '../../assets';
import AsyncButton from '../Button/AsyncButton';
import {useAuth} from '../../contexts/AuthContext';
import {navigate} from '../../navigations/RootNavigation';

interface Props {
  style?: ViewStyle;
  screen?: 'MAIN' | 'TASK' | 'TASK_DETAIL';
  navigation?: any;
}
export default function WarningDocumentBox({
  style,
  screen = 'MAIN',
  navigation,
}: Props) {
  const {
    state: {isDoneAuth},
  } = useAuth();
  if (isDoneAuth) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={image.warningDocumentImage}
        style={{
          width: 60,
          height: 60,
          position: 'absolute',
          left: 1,
          bottom: 1,
        }}
      />
      {screen === 'TASK' || screen === 'TASK_DETAIL' ? (
        <View>
          <>
            <Text style={styles.text}>กรุณาเพิ่ม “ภาพถ่ายคู่บัตร” และ</Text>
            <Text style={styles.text}>“บัญชีธนาคาร” เพื่อรับรายได้บริษัท</Text>
          </>
        </View>
      ) : (
        <View
          style={{
            marginRight: 16,
          }}>
          <Text style={styles.text}>เพิ่มเอกสารเพื่อรับของรางวัล</Text>
          <Text style={styles.text}>และสิทธิพิเศษจากบริษัท</Text>
        </View>
      )}

      <AsyncButton
        onPress={() => {
          navigation
            ? navigation.navigate('AdditionDocumentScreen')
            : navigate('AdditionDocumentScreen', {});
        }}
        title="เพิ่มเลย"
        style={{
          width: 'auto',
          minHeight: 38,
          paddingHorizontal: 16,
          borderRadius: 20,
          marginLeft: 16,
        }}
        styleText={{
          fontSize: 14,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FCED',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BCEBAE',
    height: 60,
    marginTop: 8,
    padding: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontFamily: font.semiBold,
    fontSize: 14,
    alignSelf: 'flex-start',
  },
});

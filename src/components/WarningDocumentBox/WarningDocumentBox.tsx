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
const listStatus = ['INACTIVE', 'REJECTED', 'OPEN', 'PENDING'];

export default function WarningDocumentBox({
  style,
  screen = 'MAIN',
  navigation,
}: Props) {
  const {
    state: {isDoneAuth, user},
  } = useAuth();
  if (user && listStatus.includes(user?.status)) {
    return null;
  }
  if (isDoneAuth) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <View
          style={{
            height: '100%',

            justifyContent: 'flex-end',
            marginRight: 8,
          }}>
          <Image
            source={image.warningDocumentImage}
            style={{
              width: 60,
              height: 60,
            }}
          />
        </View>
        {screen === 'TASK' || screen === 'TASK_DETAIL' ? (
          <View
            style={{
              paddingRight: 8,
              flex: 1,
            }}>
            <>
              <Text style={styles.text}>กรุณาเพิ่ม “ภาพถ่ายคู่บัตร” และ </Text>
              <Text style={styles.text}>
                “บัญชีธนาคาร” เพื่อรับรายได้บริษัท
              </Text>
            </>
          </View>
        ) : (
          <View>
            <Text style={styles.text}>เพิ่มเอกสารเพื่อรับของรางวัล</Text>
            <Text style={styles.text}>และสิทธิพิเศษจากบริษัท</Text>
          </View>
        )}
      </View>

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
    minHeight: 60,
    marginTop: 8,
    paddingRight: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: font.semiBold,
    fontSize: 14,
    alignSelf: 'flex-start',
  },
});

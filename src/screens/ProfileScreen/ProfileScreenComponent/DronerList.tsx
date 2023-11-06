import {Image, StyleSheet} from 'react-native';
import React from 'react';
import Text from '../../../components/Text';
import {useAuth} from '../../../contexts/AuthContext';
import {font, image} from '../../../assets';
import {normalize} from '../../../function/Normalize';

export default function DronerList() {
  const {
    state: {user},
  } = useAuth();
  return (
    <>
      <Image
        source={image.droneList}
        style={{
          width: 64,
          height: 30,
          marginBottom: 10,
        }}
      />
      <Text style={styles.text}>โดรนของฉัน ({user?.dronerDrone.length})</Text>
    </>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: normalize(16),
    fontFamily: font.medium,
  },
});

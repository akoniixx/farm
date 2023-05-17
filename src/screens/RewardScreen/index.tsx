import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../assets';
import CustomHeader from '../../components/CustomHeader';

export default function RewardScreen({navigation}: any) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.container}>
        <View style={styles.containerPoint}></View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containerPoint: {
    padding: 12,
    minHeight: 64,
    borderRadius: 12,
  },
  container: {
    padding: 16,
  },
});

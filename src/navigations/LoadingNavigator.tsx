import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import storeVersion from 'react-native-store-version';
import {isForceUpdate} from '../function/checkForceUpdate';
import {navigate} from './RootNavigation';
import colors from '../assets/colors/colors';

const LoadingNavigator: React.FC<any> = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('token');
          const fcmtoken = await AsyncStorage.getItem('fcmtoken');
          if (value !== null) {
            if (fcmtoken !== null) {
              navigation.navigate('Main');
            } else {
              navigation.navigate('Auth');
            }
          } else {
            navigation.navigate('Auth');
          }
        } catch (e) {
          console.log(e, 'get async token');
        }
      };
      const checkVersion = async () => {
        const currentVersion = VersionCheck.getCurrentVersion();

        const storeUrl = await VersionCheck.getAppStoreUrl({
          appID: '6443516628',
        });

        const playStoreUrl = await VersionCheck.getPlayStoreUrl({
          packageName: 'com.iconkaset.droner',
        });

        const {remote} = await storeVersion({
          version: currentVersion,
          androidStoreURL: playStoreUrl,
          iosStoreURL: storeUrl,
          country: 'TH',
        });

        const needUpdate = await VersionCheck.needUpdate({
          currentVersion,
          latestVersion: remote,
        });

        const isForce = isForceUpdate({
          currentVersion,
          latestVersion: remote,
        });
        const updateLater = await AsyncStorage.getItem('updateLater');
        const isDev = false;

        if (needUpdate.isNeeded) {
          // if (isDev) {
          if (updateLater === 'true' && !isForce) {
            return getData();
          }
          navigate('ForceUpdate', {
            isForce,
            isDev,
          });
        } else {
          getData();
        }
      };
      checkVersion();
    }, [navigation]),
  );
  return (
    <View style={styles.scaffold}>
      <ActivityIndicator size={'large'} color={colors.orange} />
    </View>
  );
};

const styles = StyleSheet.create({
  scaffold: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingNavigator;

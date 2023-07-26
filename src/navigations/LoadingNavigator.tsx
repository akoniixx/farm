import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './RootNavigation';
import VersionCheck from 'react-native-version-check';
import storeVersion from 'react-native-store-version';
import { isForceUpdate } from '../functions/checkForceUpdate';
import { useFocusEffect } from '@react-navigation/native';

const LoadingNavigator: React.FC<any> = ({ navigation, route }) => {
  useFocusEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          navigation.push('Main');
        } else {
          navigation.push('Auth');
        }
      } catch (e) {
        console.log(e, 'get async token');
      }
    };

    const checkVersion = async () => {
      const isDevMode = route.params?.isDevMode;
      if (isDevMode) {
        return getData();
      }

      const currentVersion = VersionCheck.getCurrentVersion();

      const storeUrl = await VersionCheck.getAppStoreUrl({
        appID: '1668317592',
      });

      const playStoreUrl = await VersionCheck.getPlayStoreUrl({
        packageName: 'com.iconkaset.farmer',
      });

      const { remote } = await storeVersion({
        version: currentVersion,
        androidStoreURL: playStoreUrl,
        iosStoreURL: storeUrl,
        country: 'TH',
      });

      const needUpdate = await VersionCheck.needUpdate({
        // currentVersion: '1.0.0',
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
  });

  return (
    <View style={styles.scaffold}>
      <Text>Loading...</Text>
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

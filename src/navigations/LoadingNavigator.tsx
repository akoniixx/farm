import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import storeVersion from 'react-native-store-version';
import {isForceUpdate} from '../function/checkForceUpdate';
import {navigate} from './RootNavigation';

const LoadingNavigator: React.FC<any> = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('token');
          const fcmtoken = await AsyncStorage.getItem('fcmtoken');
          if (value !== null) {
            if (fcmtoken !== null) {
              navigation.push('Main');
            } else {
              navigation.push('Auth');
            }
          } else {
            navigation.push('Auth');
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

        if (needUpdate.isNeeded) {
          if (updateLater === 'true' && !isForce) {
            return;
          }
          navigate('ForceUpdate', {
            isForce,
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

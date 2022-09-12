import {Switch} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import TaskTapNavigator from '../../navigations/topTabs/TaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';

const MainScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<boolean>(false);
  const [arr] = useState([1, 2, 3, 4]);
  const [profile, setProfile] = useState({
    name: '',
    lastname: '',
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    ProfileDatasource.getProfile(droner_id)
      .then(res => {
        setProfile({
          ...profile,
          name: res.firstname,
        });
      })
      .catch(err => console.log(err));
  };
  return (
    <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
      <View style={{flex: 2}}>
        <View style={styles.headCard}>
          <View>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(24),
                color: colors.fontBlack,
              }}>
              สวัสดี, {profile.name}
            </Text>
            <View style={styles.activeContainer}>
              <Switch
                color={colors.green}
                value={active}
                onValueChange={value => setActive(value)}
              />
              <Text style={styles.activeFont}>เปิดรับงาน</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileScreen');
              }}>
              <Text style={{color: colors.fontBlack}}>menu</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{height: normalize(95)}}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {arr.map(index => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.orange,
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                  <Text style={styles.font}>รายได้วันนี้</Text>
                  <Text style={styles.font}>0</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={{flex: 4}}>
        <TaskTapNavigator />
      </View>
    </View>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  headCard: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(23),
    paddingTop: normalize(5),
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBg,
    padding: normalize(5),
    borderRadius: normalize(12),
    marginTop: normalize(10),
  },
  activeFont: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    marginLeft: normalize(18),
    color: colors.fontBlack,
  },
  font: {
    fontFamily: font.medium,
    fontSize: normalize(20),
    color: colors.white,
  },
});

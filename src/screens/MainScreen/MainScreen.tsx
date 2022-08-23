import {Switch} from '@rneui/themed';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import TaskTapNavigator from '../../navigations/topTabs/TaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MainScreen: React.FC<any> = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
  const [active, setActive] = useState<boolean>(false);
  const [arr] = useState([1,2,3,4])
  return (
    <View style={[stylesCentral.container,{ paddingTop: insets.top}]}>
      <View style={{flex: 2}}>
        <View style={styles.headCard}>
          <View>
            <Text style={{fontFamily: font.bold, fontSize: normalize(24)}}>
              สวัสดี, สมหยอย
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
            <TouchableOpacity onPress={()=>{ navigation.navigate('ProfileScreen')}}>
            <Text>dsd</Text>
            </TouchableOpacity>
            
          </View>
        </View>
        <View style={{flex:4,justifyContent:'center',alignItems:'center'}}>
            <View style={{height:normalize(95)}}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
    {arr.map(()=>(
        <View style={{backgroundColor: colors.orange,marginHorizontal:5,paddingHorizontal:10 ,justifyContent:'center',width:160,height:75,borderRadius:16}}>
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
    flex:2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(23),
    paddingTop: normalize(5),
  },
  activeContainer:{
    flexDirection: 'row',alignItems:'center',
    backgroundColor: colors.grayBg,
    padding:normalize(5),
    borderRadius: normalize(12),
    marginTop:normalize(10)
  },
  activeFont:{
    fontFamily:font.medium,
    fontSize:normalize(14),
    marginLeft:normalize(18),
  },
  font:{
    fontFamily:font.medium,
    fontSize: normalize(20),
    color: colors.white
  }
});

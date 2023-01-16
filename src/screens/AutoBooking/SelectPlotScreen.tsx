import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@rneui/base';
import React, { useEffect, useReducer, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import DatePickerCustom from '../../components/Calendar/Calendar';
import CustomHeader from '../../components/CustomHeader';
import PlotInProfile from '../../components/Plots/PlotsInProfile';
import StepIndicatorHead from '../../components/StepIndicatorHead';
import TimePicker from '../../components/TimePicker/TimePicker';
import { PlotDatasource } from '../../datasource/PlotDatasource';
import { height, normalize, width } from '../../functions/Normalize';
import { initProfileState, profileReducer } from '../../hook/profilefield';



const SelectPlotScreen: React.FC<any> = ({ navigation }) => {
    
    const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
    const [plotList,setPlotList] = useState<any>()
    const [loading, setLoading] = useState(false);

    const getPlotlist = async() => {
        setLoading(true)
        const farmer_id = await AsyncStorage.getItem('farmer_id');
        PlotDatasource.getPlotlist(farmer_id!)
        .then(res => {
           setPlotList(res)
           setTimeout(() => setLoading(false), 200);
        })
        .catch(err => console.log(err));
    }
    useEffect(() => {
        getPlotlist()
       
      }, []);

      console.log(plotList)
    return (
        <>
            <StepIndicatorHead
                curentPosition={1}
                onPressBack={() => navigation.goBack()}
                label={'เลือกแปลงของคุณ'}
            />
            
{plotList?.data?.length === 0 ? (
                <View>
                    
                  <Image
                    source={image.empty_plot}
                    style={{
                      width: normalize(138),
                      height: normalize(120),
                      alignSelf: 'center',
                      top: '5%',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: font.SarabunLight,
                      fontSize: normalize(16),
                      color: colors.gray,
                      textAlign: 'center',
                      paddingVertical: normalize(22),
                    }}>{`คุณไม่มีแปลงเกษตร
 กดเพิ่มแปลงเกษตรได้เลย!`}</Text>

                  <View style={[styles.buttonAdd]}>
                    <Text style={styles.textaddplot}>+ เพิ่มแปลงเกษตร</Text>
                  </View>
                </View>
              ) : (
                <View style={{top: 5}}>
                    <Text>sds</Text>
                    {/*  {console.log(plotList?.data)} */}
                   {plotList?.data.map((i:any)=>(
<Text>{i.id}</Text>

                   ))}
                  <ScrollView
                    style={{paddingVertical: 10}}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                  
                  </ScrollView>
                </View>
              )}
           
        </>
    )
}
export default SelectPlotScreen

const styles = StyleSheet.create({
    label: {
        fontFamily: font.AnuphanMedium,
        fontSize: normalize(20),
        color: colors.fontBlack,
    },
    input: {
        fontFamily: font.SarabunLight,
        height: normalize(56),
        marginVertical: 12,
        padding: 5,
        borderColor: colors.disable,
        borderWidth: 1,
        borderRadius: normalize(10),
        color: colors.fontBlack,
        fontSize: normalize(16),
    },
    h1: {
        fontFamily: font.AnuphanBold,
        fontSize: normalize(20),
        color: colors.greenLight,
    },
    buttonAdd: {
        borderColor: '#1F8449',
        borderWidth: 1,
        borderRadius: 10,
        height: normalize(80),
        width: normalize(350),
        borderStyle: 'dashed',
        position: 'relative',
        alignSelf: 'center',
      },
      textaddplot: {
        fontFamily: font.AnuphanBold,
        fontSize: normalize(20),
        color: colors.greenLight,
        textAlign: 'center',
        top: '30%',
      },
})


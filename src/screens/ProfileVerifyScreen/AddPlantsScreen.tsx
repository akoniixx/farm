import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize} from '@rneui/themed';
import colors from '../../assets/colors/colors';
import {font, icons, image, image as img} from '../../assets';
import {PlantSelect} from '../../components/PlantSelect';
import {plantList} from '../../definitions/plants';
import {MainButton} from '../../components/Button/MainButton';
import Lottie from 'lottie-react-native';
import {Register} from '../../datasource/AuthDatasource';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPlantsScreen: React.FC<any> = ({route, navigation}) => {
  const [plantListSelect, setPlantListSelect] = useState(plantList);
  const [addPlant, setAddPlant] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [percentSuccess, setPercentSuccess] = useState<any>();

  useEffect(() => {
    const getProfile = async () => {
      const droner_id = await AsyncStorage.getItem('droner_id');
      await ProfileDatasource.getProfile(droner_id!).then(res => {
        setPercentSuccess(res.percentSuccess)
        let mapPlants = plantListSelect.map(x => {
          if (res.expPlant.includes(x.value)) {
            return {
              ...x,
              active: true,
            };
          } else {
            return {...x};
          }
        });
        res.expPlant.map((x: any) => {
          if (!mapPlants.some(val => val.value === x)) {
            mapPlants.push({
              value: x,
              active: true,
            });
          }
        });
        setPlantListSelect(mapPlants);
      });
    };
    getProfile();
  }, []);

  const handleSelect = (
    value: any,
    index: number,
    label: string,
    status: boolean,
  ) => {
    const data = [...value];
    data[index].active = !status;
    const resultarray = result.findIndex(e => e === label);
    if (resultarray === -1) {
      result.push(label);
    } else {
      result.splice(index, 1);
    }
    setResult(result);
    setPlantListSelect(data);
  };
  const addSelect = (value: string) => {
    const data = [...plantListSelect];
    const resultarray = data.findIndex(e => e.value === value);
    if (resultarray === -1) {
      const newplant = {value: value, active: true};
      data.push(newplant);
      setPlantListSelect(data);
      setAddPlant('')
      
    }
  };
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title={'เพิ่มพืชที่เคยฉีดพ่น'}
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inner}>
          <View
            style={{
              marginBottom: normalize(20),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={[styles.h1]}>พืชที่เคยฉีดพ่น</Text>
            <Text style={[styles.h2, {color: colors.gray, left: 10}]}>
              (กรุณาเลือกอย่างน้อย 1 อย่าง)
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {plantListSelect.map((v, i) => (
              <PlantSelect
                key={i}
                label={v.value}
                active={v.active}
                onPress={() =>
                  handleSelect(plantListSelect, i, v.value, v.active)
                }
              />
            ))}
          </View>

          <View style={styles.input}>
            <TextInput
              value={addPlant}
              placeholder="พืชอื่นๆ"
              placeholderTextColor={colors.disable}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: addPlant.length != 0 ? '80%' : '100%',
                color: colors.fontBlack,
              }}
              onChangeText={value => setAddPlant(value)}
            />
            <View style={{alignSelf: 'flex-end', bottom: '35%'}}>
              {addPlant.length != 0 ? (
                <TouchableOpacity
                  style={{
                    marginBottom: normalize(10),
                    width: normalize(60),
                    height: normalize(30),
                    borderRadius: 6,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#2BB0ED',
                  }}
                  onPress={() => addSelect(addPlant)}>
                  <Text style={[styles.h2, {color: colors.white}]}>เพิ่ม</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal transparent={true} visible={loading}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: colors.white,
              width: normalize(50),
              height: normalize(50),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: normalize(8),
            }}>
            <Lottie
              source={image.loading}
              autoPlay
              loop
              style={{
                width: normalize(50),
                height: normalize(50),
              }}
            />
          </View>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 15,
        }}>
        <MainButton
          disable={plantListSelect.every(item => item.active === false)}
          label="บันทึก"
          color={colors.orange}
          onPress={() => {
            // setLoading(true);
            let plant: string[] = [];
            plantListSelect.map(item => {
              if (item.active) {
                plant.push(item.value);
              }
            });
            Register.registerUpPlants(plant,Number(percentSuccess)  + 15)
              .then(res => {
                setLoading(false);
                navigation.navigate('MyProfileScreen');
              })
              .catch(err => {
                console.log(err);
              });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddPlantsScreen;
const styles = StyleSheet.create({
  inner: {
    justifyContent: 'center',
    paddingHorizontal: normalize(17),
  },
  h1: {
    fontFamily: font.medium,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
});

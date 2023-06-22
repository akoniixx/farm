import { stylesCentral } from "../../styles/StylesCentral";
import CustomHeader from "../../components/CustomHeader";
import { Avatar, normalize } from "@rneui/themed";
import { colors, font, icons,image as img } from "../../assets";
import { ProgressBarV2 } from "../../components/ProgressBarV2";
import * as ImagePicker from 'react-native-image-picker';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useCallback, useState } from "react";
import { MainButton } from "../../components/Button/MainButton";
import { Register } from "../../datasource/AuthDatasource";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lottie from 'lottie-react-native';

const FirstFormScreenV2 : React.FC<any>= ({navigation, route})=>{
    const tele = route.params.tele;
    const [loading, setLoading] = useState(false);
    const [formState,setFormState] = useState<any>({
        firstname : "",
        lastname : ""
    })
    const [image, setImage] = useState<any>(null);
    const onAddImage = useCallback(async () => {
        const result = await ImagePicker.launchImageLibrary({
          mediaType: 'photo',
        });
        if (!result.didCancel) {
          setImage(result);
        }
      }, [image]);
    return (
        <SafeAreaView style={stylesCentral.container}>
            <CustomHeader
              title="ลงทะเบียนนักบินโดรน"
              showBackBtn
              onPressBack={() => navigation.goBack()}
            />
            <View style={styles.inner}>
                <View style={styles.container}>
                  <View style={{marginBottom: normalize(10)}}>
                    <ProgressBarV2 index={1} />
                  </View>
                  <Text style={styles.label}>ขั้นตอนที่ 1 จาก 3</Text>
                  <Text style={styles.h1}>กรอกข้อมูลทั่วไป</Text>
                  <ScrollView>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: normalize(40),
                      }}>
                      <TouchableOpacity onPress={onAddImage}>
                        <View
                          style={{
                            width: normalize(116),
                            height: normalize(116),
                            position: 'relative',
                          }}>
                          <Avatar
                            size={116}
                            rounded
                            source={!image ? icons.account : {uri: image.assets[0].uri}}
                          />
                          <View
                            style={{
                              position: 'absolute',
                              left: normalize(70.7),
                              top: normalize(70.7),
                              width: normalize(32),
                              height: normalize(32),
                              borderRadius: normalize(16),
                              backgroundColor: colors.white,
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={icons.camera}
                              style={{
                                width: normalize(20),
                                height: normalize(20),
                              }}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{marginTop: normalize(40)}}>
                      <Text style={styles.h1}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
                    </View>
                    <TextInput
                      onChangeText={value => {
                        setFormState({
                            ...formState,
                            firstname : value
                        })
                      }}
                      value={formState.firstname}
                      style={styles.input}
                      editable={true}
                      placeholder={'ชื่อ'}
                      placeholderTextColor={colors.disable}
                    />
                    <TextInput
                      onChangeText={value => {
                        setFormState({
                            ...formState,
                            lastname : value
                        })
                      }}
                      value={formState.surname}
                      style={styles.input}
                      editable={true}
                      placeholder={'นามสกุล'}
                      placeholderTextColor={colors.disable}
                    />
                    <TextInput
                      value={tele}
                      style={[styles.input, {backgroundColor: colors.disable}]}
                      editable={false}
                      placeholder={'เบอร์โทรศัพท์'}
                      placeholderTextColor={colors.disable}
                    />
                  </ScrollView>
                  <View style={{backgroundColor: colors.white, zIndex: 0}}>
                    <MainButton
                      disable={!formState.firstname || !formState.lastname}
                      color={colors.orange}
                      label="ถัดไป" 
                      onPress={()=>{
                        setLoading(true)
                        Register.registerStep1V2(
                            formState.firstname,
                            formState.lastname,
                            tele
                        ).then(async res => {
                            if(!image){
                              setLoading(false)
                              await AsyncStorage.setItem("droner_id",res.id)
                              navigation.navigate('SecondFormScreenV2', {
                                  tele: route.params.telNumber,
                              });
                            }
                            else{
                              Register.uploadProfileImage(image).then(
                                async resImg => {
                                  setLoading(false)
                                  await AsyncStorage.setItem("droner_id",res.id)
                                  navigation.navigate('SecondFormScreenV2', {
                                      tele: route.params.telNumber,
                                  });
                                }
                              )
                            }
                        }).catch(err => console.log(err))
                      }}
                    />
                  </View>
                </View>
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
                        source={img.loading}
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    inner: {
      paddingHorizontal: normalize(17),
      flex: 1,
      justifyContent: 'space-around',
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
      marginTop: normalize(24),
    },
    label: {
      fontFamily: font.light,
      fontSize: normalize(14),
      color: colors.gray,
    },
    container: {
      flex: 1,
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

export default FirstFormScreenV2
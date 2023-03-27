import React, { useCallback, useState } from "react"
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors, font, icons } from "../../../assets"
import { normalize, width } from "../../../function/Normalize"
import { stylesCentral } from "../../../styles/StylesCentral"
import * as ImagePicker from 'react-native-image-picker';
import { MainButton } from "../../../components/Button/MainButton"

const UploadDronerLicenseScreen: React.FC<any> = ({ navigation, route }) => {
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
        <SafeAreaView style={[stylesCentral.container]}>
            <View style={styles.appBarBack}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={icons.arrowLeft} style={styles.listTileIcon} />
                </TouchableOpacity>
                <Text style={[styles.appBarHeader]}>อัพโหลดใบอนุญาตนักบิน </Text>
                <View style={styles.listTileIcon} />
            </View>

            <View style={styles.body}>
                        <View style={{ marginVertical: normalize(16),marginTop:normalize(40) }}>
                            <Text style={styles.h1}>อัพโหลดใบอนุญาตนักบิน</Text>
                        </View>
                        <TouchableOpacity
                        style={{
                            marginVertical: 20,
                        }}
                        onPress={onAddImage}>
                        {image == null ? (
                            <View style={styles.addImage}>
                                <View style={styles.camera}>
                                    <Image
                                        source={icons.camera}
                                        style={{
                                            width: 19,
                                            height: 16,
                                        }}
                                    />

                                </View>
                                <Text>เพิ่มเอกสารด้วย ไฟล์รูป </Text>
                            </View>
                        ) : (

                            <View style={{
                                width: width * 0.9,
                                height: normalize(76),
                                borderRadius: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFBF6',
                                borderColor: '#FF981E',
                                borderWidth: 1,
                                paddingHorizontal: normalize(10)
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image
                                        source={{ uri: image.assets[0].uri }}
                                        style={{
                                            width: normalize(36),
                                            height: normalize(36),

                                        }}
                                    />
                                    <View style={{ width: '70%', marginLeft: 10 }}>
                                        <Text ellipsizeMode="tail" numberOfLines={1}>{image.assets[0].fileName}</Text>

                                    </View>
                                   
                                </View>
                                <Image source={icons.closeBlack} style={{ width: normalize(16), height: normalize(16) }} />

                            </View>

                        )}
                    </TouchableOpacity>
                    <MainButton label="บันทึก" color={"#FB8705"} disable={image === null} />
                    </View>

                  

                   
            </SafeAreaView>
    )
}
export default UploadDronerLicenseScreen

const styles = StyleSheet.create({
    appBarBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(12),
        alignItems: 'center',
    },
    appBarHeader: {
        fontFamily: font.bold,
        fontSize: normalize(19),
        color: colors.fontBlack,
    },

    listTileIcon: {
        width: normalize(24),
        height: normalize(24),
        color: colors.fontBlack,
    },
    header: {
        fontFamily: font.bold,
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(5),
        fontSize: normalize(18),
        color: colors.fontBlack,
    },
    body: {
        paddingHorizontal: normalize(16)
    },
    h1: {
        fontFamily: font.medium,
        fontSize: normalize(16)
    },
    input: {
        height: normalize(56),
        marginVertical: 12,
        padding: 10,
        borderColor: '#DCDFE3',
        borderWidth: 1,
        borderRadius: normalize(10),
        color: colors.fontBlack,
    },
    addImage: {
        width: width * 0.9,
        height: normalize(162),
        borderColor: '#FF981E',
        borderStyle: 'dotted',
        borderWidth: 0.5,
        backgroundColor: '#FAFAFB',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    camera: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    label: {
        fontFamily: font.light,
        fontSize: normalize(16),
        color: colors.gray,
    },
    bankIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
      },
});
import { View, Text, Modal, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { normalize } from '@rneui/themed';
import { colors, icons } from '../../assets';
import { MainButton } from '../Button/MainButton';
import fonts from '../../assets/fonts';
import image from '../../assets/images/image';

interface RegisterModalNotiFication {
    onClick? : ()=> void;
    onClose? : () => void;
    value : boolean
}
const width = Dimensions.get('screen').width;
const RegisterNotification: React.FC<RegisterModalNotiFication>  = ({onClick,onClose,value}) => {
  return (
    <Modal
        transparent={true}
        visible={value}
    >
        <View style={styles.modal}>
            <View style={styles.modalBg}>
                <View style={styles.close}>
                    <TouchableOpacity onPress={onClose}>
                        <Image source={icons.close} style={{
                            width : normalize(14),
                            height : normalize(14)
                        }}/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.modalHeader}>
                    การยืนยันตัวตนของท่าน
                </Text>
                <Text style={styles.modalHeader}>
                    ได้รับการยืนยันเรียบร้อยแล้ว
                </Text>
                <Image source={image.registerconfirmnoti} style={{
                    marginVertical : normalize(20)
                }}/>
                <View style={{
                    width : '100%'
                }}>
                    <MainButton label='ตกลง' color={colors.orange} fontColor={colors.white} onPress={onClick}/>
                </View>
            </View>
        </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
    modal : {
        flex : 1,
        backgroundColor : 'rgba(0,0,0,0.5)',
        justifyContent : 'center',
        alignItems : 'center'
    },
    close : {
        position : 'absolute',
        top : normalize(20),
        right : normalize(20)
    },
    modalBg : {
        position : 'relative',
        backgroundColor : colors.white,
        width : width*0.8,
        paddingVertical : normalize(30),
        paddingHorizontal : normalize(20),
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : normalize(8)
    },
    modalHeader:{
        color : colors.fontBlack,
        fontFamily : fonts.medium,
        fontSize : normalize(19)
    }
})
export default RegisterNotification
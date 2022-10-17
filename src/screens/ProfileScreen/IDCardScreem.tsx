// import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
// import React from 'react'
// import { stylesCentral } from '../../styles/StylesCentral'
// import { normalize } from '../../function/Normalize'
// import { font, icons } from '../../assets'

// const IDCardScreen :  React.FC<any> = ({navigation}) => {
//   return (
//     <SafeAreaView style={[stylesCentral.center]}>
//         <View style={styles.appBarBack}>
//             <TouchableOpacity onPress={()=> navigation.goBack()}>
//               <Image source={icons.arrowLeft} style={styles.listTileIcon}/>
//             </TouchableOpacity>
//             <Text style={[styles.appBarHeader]}>{viewprofile?"แก้ไขโปรไฟล์":"ข้อมูลโปรไฟล์"}</Text>
//             <View style={styles.listTileIcon}></View>
//         </View>
//         <View style={styles.body}>

//         </View>
//     </SafeAreaView>
//   )
// }

// export default IDCardScreen

// const styles = StyleSheet.create({
//     appBarBack:{
//         flex : 1,
//         flexDirection : 'row',
//         justifyContent : 'space-between',
//         paddingHorizontal : normalize(12),
//         alignItems : 'center'
//       },
//       appBarHeader : {
//         fontFamily: font.bold,
//         fontSize : normalize(19)
//       },
//       body:{
//         flex : 9,
//         paddingTop : normalize(10),
//         paddingHorizontal : normalize(17)
//       },
// })

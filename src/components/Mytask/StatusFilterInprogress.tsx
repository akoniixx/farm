import { normalize } from '@rneui/themed';
import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image } from 'react-native';
import { Picker, onOpen } from 'react-native-actions-sheet-picker';
import { colors, font, icons } from '../../assets';
import { sortField, sortStatusInprogress,  } from '../../definitions/taskFilter';

interface props{
  selectedStatus: {
    name: string,
    value: string, 
  },
  setSelectedStatus: (value:any)=> void

}


export  const StatusFilterInprogress:React.FC<props> = ({selectedStatus,setSelectedStatus}) => {
 
  const [status, setStatus] = useState<any>([]);
 
 

  useEffect(() => {
    setStatus(sortStatusInprogress)
   
  }, []);



  return (
    <>
      
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onOpen('status');
          }}
        >
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <Text style={styles.h1}>{selectedStatus && selectedStatus.name}</Text>
            <Image source={icons.chevron} style={{width:normalize(14),height:(8),marginLeft:normalize(10)}} />
          </View>

        </TouchableOpacity>
        
    <Picker
          id="status"
          data={status}
          label="แสดงสถานะงาน"
          setSelected={setSelectedStatus}
        />
   </>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    borderWidth:0.5,
    borderColor:'#C0C5CA',
    padding:normalize(10),
    borderRadius:10,
    minWidth:normalize(160)
  },
  h1:{
    fontSize:normalize(18),
    fontFamily: font.SarabunMedium,
    color: '#8D96A0',
  }
});

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';

const SelectDateScreen: React.FC<any> = ({}) => {
    return (
<SafeAreaView>
<CustomHeader
            title="เข้าสู่ระบบ"
            showBackBtn
           /*  onPressBack={() => navigation.goBack()} */
          /> 
</SafeAreaView>
    )
}
export default SelectDateScreen
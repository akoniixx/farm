import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Button,
  } from 'react-native';
  import React, {useState} from 'react';
  import {SafeAreaView} from 'react-native-safe-area-context';
  import {stylesCentral} from '../../styles/StylesCentral';
  import {colors, font} from '../../assets';
  import {normalize} from '../../function/Normalize';
  import CustomHeader from '../../components/CustomHeader';
  import {InputPhone} from '../../components/InputPhone';
  import {MainButton} from '../../components/Button/MainButton';
  
  const PinScreen: React.FC<any> = ({navigation}) => {
    const [value, setValue] = useState<string>('');
    const [isError, setIsError] = React.useState(false);
  
    const [message, setMessage] = React.useState<string>('');
    return (
      
          <SafeAreaView style={stylesCentral.container}>
           <Text>dsds</Text>
          </SafeAreaView>
       
    );
  };
  export default PinScreen;
  
  const styles = StyleSheet.create({
    inner: {
      paddingHorizontal: normalize(17),
      flex: 1,
      justifyContent: 'space-around',
    },
    headText: {
      fontFamily: font.bold,
      fontSize: normalize(20),
      marginBottom: normalize(24),
    },
    label: {
      fontFamily: font.light,
      fontSize: normalize(14),
      color: colors.gray,
      marginTop: normalize(24),
    },
    containerTopCard: {
      flex: 1,
      paddingTop: normalize(70),
    },
  });
  
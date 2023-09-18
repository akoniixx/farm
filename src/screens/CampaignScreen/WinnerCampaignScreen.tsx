import React, {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import {
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import icons from '../../assets/icons/icons';
import {normalize} from '../../function/Normalize';
import {mixpanel} from '../../../mixpanel';
import {CardGuru} from '../../components/Guru/CardGuru';
import {useIsFocused} from '@react-navigation/native';
import {GuruKaset} from '../../datasource/GuruDatasource';
import {momentExtend} from '../../function/utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Text from '../../components/Text';

const WinnerCampaignScreen: React.FC<any> = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const filterNews = useRef<any>();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [data, setData] = useState<any>();

  useEffect(() => {
    findAllNews();
  }, [isFocused]);
  const findAllNews = async () => {
    setLoading(true);
    GuruKaset.findAllNews({
      application: 'DRONER',
      status: 'ACTIVE',
      categoryNews: 'CHALLENGE',
      sortField: 'created_at',
      sortDirection: 'DESC',
      limit: 99,
    })
      .then(res => {
        if (res) {
          setData(res);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="ประกาศรายชื่อผู้โชคดี"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('กดย้อนกลับจากหน้าประกาศรายชื่อทอง');
          navigation.goBack();
        }}
      />
      {data != undefined ? (
        <View>
          <ScrollView>
            {data != undefined &&
              data.data.map((item: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    mixpanel.track('กดอ่านกูรูเกษตรในหน้ารวมข่าวสาร');
                    await AsyncStorage.setItem('guruId', `${item.id}`);
                    navigation.push('DetailGuruScreen');
                  }}>
                  <CardGuru
                    key={index}
                    index={item.index}
                    background={item.image_path}
                    title={item.title}
                    date={momentExtend.toBuddhistYear(
                      item.created_at,
                      'DD MMM YY',
                    )}
                    read={item.read}
                  />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={icons.winnerCampaignBlank}
            style={{width: normalize(125), height: normalize(100)}}
          />
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: normalize(15),
              color: colors.gray,
            }}>
            ติดตามประกาศรายชื่อผู้โชคดีได้เร็วๆ นี้
          </Text>
        </View>
      )}

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
};

export default WinnerCampaignScreen;

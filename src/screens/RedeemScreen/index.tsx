import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {colors, font, icons} from '../../assets';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import DashedLine from 'react-native-dashed-line';
import {momentExtend} from '../../function/utility';
import moment from 'moment';
import {SheetManager} from 'react-native-actions-sheet';
import {BASE_URL, httpClient} from '../../config/develop-config';

interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'RedeemScreen'>;
}
interface Branch {
  createdAt: string;
  id: string;
  isActive: boolean;
  name: string;
  nameEn: string | null;
  updatedAt: string;
}
export default function RedeemScreen({navigation, route}: Props) {
  const {data} = route.params;
  const [selectedArea, setSelectedArea] = React.useState<any>(null);
  const [dataBranch, setDataBranch] = React.useState<Branch[]>([]);
  useEffect(() => {
    const getBranch = async () => {
      try {
        const result = await httpClient.get(BASE_URL + '/branch');
        setDataBranch(result.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getBranch();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <CustomHeader
        headerRight={() => {
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 16,
              }}>
              <Image
                source={icons.closeBlack}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView contentContainerStyle={{flexGrow: 1, padding: 16}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View style={styles.card}>
              <Image
                resizeMode="contain"
                source={data.image}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 10,
                  flex: 0.2,
                }}
              />
              <View
                style={{
                  flex: 0.8,
                  flexDirection: 'row',
                  height: 72,
                  paddingLeft: 16,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flex: 0.8,
                    height: 72,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: font.bold,
                    }}>
                    ส่วนลด ศูนย์ ICPX มูลค่า 1,500 บาท
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 16,
                      fontFamily: font.light,
                    }}>
                    สถานะ :{' '}
                    <Text
                      style={{
                        fontFamily: font.bold,
                        color: colors.orange,
                      }}>
                      พร้อมใช้
                    </Text>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => console.log('test')}
                  style={{
                    flex: 0.2,
                    alignItems: 'flex-end',
                  }}>
                  <Image
                    source={icons.arrowRight}
                    style={{
                      width: 32,
                      height: 32,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <DashedLine
              dashLength={14}
              dashGap={4}
              dashColor={colors.grey3}
              style={{
                marginHorizontal: 10,
              }}
            />
            <View style={styles.cardContent}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-start',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: font.light,
                  }}>
                  หมดอายุการใช้{' '}
                  {momentExtend.toBuddhistYear(
                    moment().add(1, 'days').toISOString(),
                    'DD MMM YYYY ',
                  )}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 32,
                  fontFamily: font.bold,
                }}>
                9KNQKFDKH1
              </Text>
              <View
                style={{
                  height: 42,
                  width: '100%',
                  justifyContent: 'center',
                  backgroundColor: colors.orangeSoft,
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    fontFamily: font.medium,
                    color: colors.darkOrange2,
                  }}>
                  รหัสการทำรายการ RD00000001
                </Text>
              </View>
            </View>
            <View style={styles.warningBox}>
              <Image
                source={icons.warningDanger}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <Text
                style={{
                  flex: 0.95,
                  marginLeft: 8,
                  fontSize: 12,
                  fontFamily: font.medium,
                  color: colors.decreasePoint,
                }}>
                ท่านสามารถใช้ส่วนลดนี้ โดยไปที่หน้าสาขาที่ต้องการใช้บริการ
                พร้อมยื่นแสดงหน้าจอส่วนลดนี้ให้กับเจ้าหน้าที่
                เพื่อให้เจ้าหน้าที่ ยืนยันการใช้สิทธิ์
              </Text>
            </View>
          </View>
          <View
            style={{
              marginBottom: 16,
            }}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={async () => {
                const result: {
                  selected: any;
                } = await SheetManager.show('selectArea', {
                  payload: {
                    selected: selectedArea,
                    data: dataBranch,
                  },
                });
                if (result?.selected) {
                  setSelectedArea(result.selected);
                }
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 20,
                  fontFamily: font.bold,
                }}>
                กดรับสิทธิ์ (เฉพาะเจ้าหน้าที่)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.grey3,
    borderRadius: 10,
    flexDirection: 'row',
  },
  cardContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.grey3,
    borderRadius: 10,
    backgroundColor: 'white',
    minHeight: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.decreasePoint,
    padding: 8,
    marginTop: 16,
    minHeight: 58,
    flexDirection: 'row',
  },
});

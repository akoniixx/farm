import { normalize } from '@rneui/themed';
import React, { useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import icons from '../../assets/icons/icons';
import image from '../../assets/images/image';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import InputWithSuffix from '../../components/InputText/InputWithSuffix';
import {
  DateTimeDetail,
  PlotDetail,
  TargetSpray,
} from '../../components/TaskDetail/TaskDetail';
import { numberWithCommas } from '../../functions/utility';

const DetailTaskScreen: React.FC<any> = ({ navigation, route }) => {
  const totalPrice = 1000;
  const [showListPrice, setShowListPrice] = useState(false);
  return (
    <View style={[{ flex: 1 }]}>
      <CustomHeader
        title="รายละเอียดการจอง"
        showBackBtn
        onPressBack={() => navigation.goBack()}
        headerRight={() => {
          return (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('tel:0812345678');
              }}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                marginTop: 4,
              }}>
              <Image
                source={icons.callCenter}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 10,
            paddingVertical: normalize(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: normalize(16),
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              วันและเวลา
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectDateScreen')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.blueMedium,
                }}>
                แก้ไข
              </Text>
              <Image
                source={icons.arrowRightBlue}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            </TouchableOpacity>
          </View>
          <DateTimeDetail time="18.00" date="15 พฤศจิกายน" note="-" />
        </View>

        <View
          style={{
            paddingHorizontal: normalize(16),
            backgroundColor: 'white',
            marginTop: 10,
            paddingVertical: normalize(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              แปลงเกษตร
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectPlotScreen')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.blueMedium,
                }}>
                แก้ไข
              </Text>
              <Image
                source={icons.arrowRightBlue}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            </TouchableOpacity>
          </View>

          <PlotDetail
            onPressMap={() =>
              navigation.navigate('ViewMapScreen', {
                location: {
                  latitude: 13.736717,
                  longitude: 100.523186,
                },
              })
            }
            plotName="แปลง 1 ข้าวโพด"
            plotAmout={20}
            plant="ข้าวโพด"
            location="บ้านลุงตู่ จุ๊กกรู้ววววว"
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              เป้าหมายการพ่น
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectTarget')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.blueMedium,
                }}>
                แก้ไข
              </Text>
              <Image
                source={icons.arrowRightBlue}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            </TouchableOpacity>
          </View>
          <TargetSpray
            periodSpray="คุมเลน"
            target="หญ้า"
            preparationBy="เกษตรเตรียมเอง"
          />
        </View>
        <View
          style={{
            paddingHorizontal: normalize(16),
            backgroundColor: 'white',
            marginTop: 10,
            paddingVertical: normalize(16),
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.AnuphanMedium,
            }}>
            นักบินโดรน
          </Text>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 10,
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={image.bg_droner}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                }}
              />
              <View
                style={{
                  marginLeft: 16,
                }}>
                <Text
                  style={{
                    color: colors.fontBlack,
                    fontFamily: fonts.SarabunMedium,
                    fontSize: 18,
                  }}>
                  นายโดรน เกษตร
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 16,
                      height: 16,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 4,
                      color: colors.gray,
                    }}>
                    5.0 คะแนน (10)
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
              borderWidth: 1,
              borderColor: colors.greyDivider,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.SarabunLight,
              }}>
              อัตราค่าจ้าง
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.AnuphanMedium,
                color: colors.greenLight,
              }}>
              50 บาท/ ไร่
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 10,
            paddingVertical: normalize(16),
          }}>
          <View
            style={{
              paddingHorizontal: normalize(16),
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              วิธีการชำระเงิน
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
              }}>
              <Image
                source={icons.cash}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 8,
                  fontFamily: fonts.SarabunMedium,
                }}>
                เงินสด
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.greyDivider,
              marginLeft: normalize(16),
              marginTop: 16,
            }}
          />
          <View
            style={{
              paddingHorizontal: normalize(16),
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <Image
              source={icons.discountOrange}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.SarabunMedium,
              }}>
              คูปองส่วนลด
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: normalize(16),
            }}>
            <InputWithSuffix
              placeholder="ระบุรหัสคูปองที่นี่"
              styleContainer={{
                backgroundColor: '#F2F3F4',
                borderWidth: 0,
              }}
              suffixComponent={
                <TouchableOpacity
                  onPress={() => {
                    console.log('add coupon');
                  }}
                  style={{
                    backgroundColor: '#56D88C',
                    width: 60,
                    height: 35,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 18,
                      fontFamily: fonts.AnuphanMedium,
                    }}>
                    ยืนยัน
                  </Text>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
        <View
          style={{
            height: 50,
          }}
        />
      </ScrollView>
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: 16,
          paddingBottom: 32,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.06,
          shadowRadius: 1.62,
          elevation: 14,
        }}>
        {showListPrice && (
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                ราคาต่อไร่
              </Text>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                50 บาท/ไร่
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 16,
                borderBottomWidth: 1,
                marginBottom: 16,
                borderBottomColor: colors.greyDivider,
              }}>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                ราคารวม
              </Text>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                {`${numberWithCommas(totalPrice.toString(), true)} บาท`}
              </Text>
            </View>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fonts.AnuphanMedium,
            }}>
            รวมค่าบริการ
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowListPrice(!showListPrice);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: colors.greenLight,
                fontSize: 18,
                fontFamily: fonts.AnuphanMedium,
                marginRight: 8,
              }}>
              {`${numberWithCommas(totalPrice.toString(), true)} บาท`}
            </Text>
            <Image
              source={icons.arrowUpBold}
              style={{
                width: 16,
                height: 16,
                transform: [{ rotate: showListPrice ? '0deg' : '180deg' }],
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderBottomColor: colors.greyDivider,
            borderBottomWidth: 1,
          }}>
          <MainButton
            label="ยืนยันการจอง"
            color={colors.greenLight}
            style={{
              height: 54,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default DetailTaskScreen;

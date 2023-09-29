import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons } from '../../assets';
import fonts from '../../assets/fonts';
import Text from '../Text/Text';

interface AddPlot {
  index: number;
  plotName: string;
  raiAmount: number;
  plantName: string;
  status: string;
  locationName: string;
  reason?: string;
  onClick?: () => void;
}

export function StatusObject(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FFF2E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
      };
    case 'ACTIVE':
      return {
        status: 'ตรวจสอบแล้ว',
        colorBg: colors.white,
        fontColor: colors.greenLight,
        borderColor: colors.greenLight,
      };
    case 'REJECTED':
      return {
        status: 'ไม่อนุมัติ',
        colorBg: '#FFF0F0',
        fontColor: colors.error,
        borderColor: colors.error,
      };
    case 'INACTIVE':
      return {
        status: 'ปิดการใช้งาน',
        colorBg: '#FFF',
        fontColor: colors.fontBlack,
        borderColor: colors.gray,
      };
    default:
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FFF2E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
      };
  }
}

const PlotsItemEdit: React.FC<AddPlot> = ({
  index,
  plotName,
  raiAmount,
  plantName,
  status,
  locationName,
  reason,
  onClick,
}) => {
  return (
    <View
      style={{
        width: '100%',
      }}>
      {StatusObject(status).status === 'ตรวจสอบแล้ว' && (
        <View
          key={index}
          style={{
            height: 'auto',
            borderWidth: 0.5,
            borderColor: colors.greenLight,
            backgroundColor: '#ECFBF2',
            borderRadius: normalize(12),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(20),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(10),
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0.8,
                    }}>
                    <Text style={[styles.title]} numberOfLines={1}>
                      {plotName}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                    <Image
                      source={icons.arrowRigth}
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                      }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: normalize(10),
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.plot}
                    style={{
                      width: normalize(18),
                      height: normalize(20),
                      marginRight: normalize(10),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                    }}>
                    {raiAmount + ' ' + 'ไร่'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.plant}
                    style={{
                      width: normalize(18),
                      height: normalize(20),
                      marginRight: normalize(10),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                      marginRight: '10%',
                    }}>
                    {plantName}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={icons.location}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '10%',
                    width: normalize(270),
                  }}>
                  {locationName}
                </Text>
              </View>
              {/* <View
                style={{
                  marginTop: 10,
                  width: normalize(109),
                  height: normalize(24),
                  borderRadius: normalize(12),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: StatusObject(status).colorBg,
                  borderColor: StatusObject(status).borderColor,
                  borderWidth: 0.5,
                }}>
                <Text
                  style={[
                    styles.label,
                    { color: StatusObject(status).fontColor },
                  ]}>
                  {StatusObject(status).status}
                </Text>
              </View> */}
            </View>
          </View>
        </View>
      )}
      {StatusObject(status).status === 'รอการตรวจสอบ' && (
        <View
          key={index}
          style={{
            height: 'auto',
            borderWidth: 0.5,
            borderColor: StatusObject(status).fontColor,
            backgroundColor: '#FFFAF3',
            borderRadius: normalize(12),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(20),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(10),
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0.8,
                    }}>
                    <Text style={[styles.title]} numberOfLines={1}>
                      {plotName}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                    <Image
                      source={icons.arrowRigth}
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                      }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: normalize(10),
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.plot}
                    style={{
                      width: normalize(18),
                      height: normalize(20),
                      marginRight: normalize(10),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                    }}>
                    {raiAmount + ' ' + 'ไร่'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.plant}
                    style={{
                      width: normalize(18),
                      height: normalize(20),
                      marginRight: normalize(10),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                      marginRight: '10%',
                    }}>
                    {plantName}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={icons.location}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '10%',
                    width: normalize(270),
                  }}>
                  {locationName}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  width: normalize(109),
                  height: normalize(24),
                  borderRadius: normalize(12),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: StatusObject(status).colorBg,
                  borderColor: StatusObject(status).borderColor,
                  borderWidth: 0.5,
                }}>
                <Text
                  style={[
                    styles.label,
                    { color: StatusObject(status).fontColor },
                  ]}>
                  {StatusObject(status).status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {StatusObject(status).status === 'ไม่อนุมัติ' && (
        <View
          key={index}
          style={{
            height: 'auto',
            borderWidth: 0.5,
            borderColor: colors.error,
            backgroundColor: '#FFFAFA',
            borderRadius: normalize(12),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(20),

            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(10),
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0.8,
                    }}>
                    <Text style={[styles.title]} numberOfLines={1}>
                      {plotName}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                    <Image
                      source={icons.arrowRigth}
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                      }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: normalize(10),
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.plot}
                    style={{
                      width: normalize(18),
                      height: normalize(20),
                      marginRight: normalize(10),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                    }}>
                    {raiAmount + ' ' + 'ไร่'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.plant}
                    style={{
                      width: normalize(18),
                      height: normalize(20),
                      marginRight: normalize(10),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                      marginRight: '10%',
                    }}>
                    {plantName}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={icons.location}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '10%',
                    width: normalize(270),
                  }}>
                  {locationName}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  width: normalize(150),
                  height: normalize(24),
                  borderRadius: normalize(12),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: StatusObject(status).colorBg,
                  borderColor: StatusObject(status).borderColor,
                  borderWidth: 0.5,
                }}>
                <Text
                  style={[
                    styles.label,
                    { color: StatusObject(status).fontColor },
                  ]}>
                  ไม่ผ่านการตรววจสอบ
                </Text>
              </View>
              <View style={styles.warning}>
                <Text style={styles.labelWarning}>หมายเหตุ : {reason}</Text>
                <Text style={styles.labelWarning}>
                  กรุณาติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข
                </Text>
                <View>
                  <TouchableOpacity
                    onPress={onClick}
                    style={{
                      marginTop: 10,
                      paddingVertical: 8,
                      backgroundColor: colors.white,
                      borderRadius: 10,
                      marginBottom: 8,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <Image
                        style={{
                          width: 24,
                          height: 24,
                          marginRight: 16,
                        }}
                        source={icons.calling}
                      />
                      <Text
                        style={{
                          fontFamily: font.AnuphanMedium,
                          color: colors.blueBorder,
                          fontSize: 20,
                        }}>
                        โทรหาเจ้าหน้าที่
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
    color: '#0D381F',
    lineHeight: normalize(28),
  },
  label: {
    fontSize: normalize(14),
    color: colors.fontGrey,
    fontFamily: font.AnuphanMedium,
  },
  labelWarning: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: '#0D381F',
    lineHeight: 30,
  },
  warning: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.error,
    paddingHorizontal: 28,
    paddingVertical: 6,
    marginTop: 10,
    borderStyle: 'dashed',
    right: '2%',
    alignSelf: 'center',
    backgroundColor: '#FFF0F0',
  },
});

export default PlotsItemEdit;

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React from 'react';
import { normalize } from '../../../functions/Normalize';
import { colors, font, icons } from '../../../assets';

interface Props {
  status: string;
  reason: string;
  setShowModalCall: (value: boolean) => void;
}
export default function ProfileRenderByStatus({
  status,
  reason,
  setShowModalCall,
}: Props) {
  if (status === 'REJECTED') {
    return (
      <View
        style={{
          width: normalize(350),
          alignSelf: 'center',
          backgroundColor: '#FFF9F2',
          borderWidth: 1,
          borderColor: '#FEDBB4',
          borderRadius: 15,
        }}>
        <View style={{ padding: 15 }}>
          <View
            style={{
              borderColor:
                status === 'REJECTED' ? colors.darkOrange : colors.fontGrey,
              borderWidth: 1,
              borderRadius: 15,
              padding: 4,
              backgroundColor:
                status === 'REJECTED' ? colors.white : colors.greyDivider,
              width: status === 'REJECTED' ? 170 : 105,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 5,
              }}>
              {status === 'REJECTED' ? (
                <Image
                  source={icons.wrong}
                  style={{
                    width: 15,
                    height: 15,
                    alignSelf: 'center',
                  }}
                />
              ) : null}

              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  color: status === 'REJECTED' ? colors.error : colors.fontGrey,
                  fontSize: normalize(14),
                }}>
                {status === 'REJECTED'
                  ? 'ยืนยันตัวตนไม่สำเร็จ'
                  : 'ปิดการใช้งาน'}
              </Text>
            </View>
          </View>
          <View style={{ paddingVertical: 8 }}>
            <Text style={[styles.textAlert]}>
              {status === 'REJECTED'
                ? reason
                : 'บัญชีของท่านถูกปิดการใช้งาน หากต้องการ'}
            </Text>
            <Text style={[styles.textAlert]}>
              {status === 'REJECTED'
                ? 'กรุณาติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข'
                : 'เปิดใช้งานบัญชี กรุณาติดต่อเจ้าหน้าที่'}
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setShowModalCall(true);
            }}
            style={{
              ...Platform.select({
                ios: {
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                },
                android: {
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                  bottom: 15,
                },
              }),
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
    );
  }

  if (status === 'INACTIVE') {
    return (
      <View
        style={{
          width: normalize(350),
          alignSelf: 'center',
          backgroundColor: '#FFF9F2',
          borderWidth: 1,
          borderColor: '#FEDBB4',
          borderRadius: 15,
        }}>
        <View style={{ padding: 15 }}>
          <View
            style={{
              borderColor: colors.fontGrey,
              borderWidth: 1,
              borderRadius: 15,
              padding: 4,
              backgroundColor: colors.greyDivider,
              width: 105,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  color: colors.fontGrey,
                  fontSize: normalize(14),
                }}>
                ปิดการใช้งาน
              </Text>
            </View>
          </View>
          <View style={{ paddingVertical: 8 }}>
            <Text style={[styles.textAlert]}>
              บัญชีของท่านถูกปิดการใช้งาน หากต้องการ
            </Text>
            <Text style={[styles.textAlert]}>
              เปิดใช้งานบัญชี กรุณาติดต่อเจ้าหน้าที่
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setShowModalCall(true);
            }}
            style={{
              ...Platform.select({
                ios: {
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                },
                android: {
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                  bottom: 15,
                },
              }),
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
    );
  }
  if (status === 'PENDING') {
    return (
      <View
        style={{
          width: normalize(350),
          alignSelf: 'center',
          backgroundColor: '#FFF9F2',
          borderWidth: 1,
          borderColor: '#FEDBB4',
          borderRadius: 15,
        }}>
        <View style={{ padding: 15 }}>
          <View
            style={{
              borderColor: colors.darkOrange,
              borderWidth: 1,
              borderRadius: 15,
              padding: 4,
              backgroundColor: '#FFF2E3',
              width: 125,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  color: '#E27904',
                  fontSize: normalize(14),
                }}>
                รอการตรวจสอบ
              </Text>
            </View>
          </View>
          <View style={{ paddingVertical: 8 }}>
            <Text style={[styles.textAlert]}>
              ขณะนี้เจ้าหน้าที่กำลังตรวจสอบเอกสารยืนยันของคุณอยู่
              สอบถามข้อมูลเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setShowModalCall(true);
            }}
            style={{
              ...Platform.select({
                ios: {
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                },
                android: {
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                  bottom: 15,
                },
              }),
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
    );
  }
  return <></>;
}
const styles = StyleSheet.create({
  textAlert: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    lineHeight: 26,
  },
});

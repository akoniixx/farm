import {BaseToast, ErrorToast, ToastProps} from 'react-native-toast-message';
import colors from '../assets/colors/colors';
import React from 'react';
import {height, normalize} from '../function/Normalize';
import {font} from '../assets';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import icons from '../assets/icons/icons';
import Toast from 'react-native-toast-message';
import {TabActions} from '@react-navigation/native';
import {responsiveHeigth, responsiveWidth} from '../function/responsive';
import fonts from '../assets/fonts';
import { callCenterDash, callcenterNumber } from '../definitions/callCenterNumber';

const toastStyle = {
  backgroundColor: '#3EBD93',
  borderRadius: 16,
  width: '90%',
  height: normalize(90),
};

const text1Style = {
  color: '#FFFFFF',
  fontFamily: font.bold,
  fontSize: normalize(16),
  paddignLeft: 10,
};

const text2Style = {
  color: '#FFFFFF',
  fontFamily: font.light,
  fontSize: normalize(16),
  paddignLeft: 10,
};

export const toastConfig = {
  receiveTaskSuccess: ({onPress, text1, text2, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgSuccess}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.closecircle}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>{text1}</Text>
            <Text style={styles.info}>{text2}</Text>
            <Text style={styles.info}>ถูกรับแล้ว</Text>
            <Text style={styles.infolight}>
              อย่าลืมติดต่อหาเกษตรกรก่อนเริ่มงาน
            </Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
          <View />
        </View>
      </View>
    </TouchableOpacity>
    // <View
    //   style={{
    //     ...toastStyle,
    //     paddingLeft: 20,
    //     paddingRight: 20,
    //     display: 'flex',
    //     flexDirection: 'row',
    //   }}>
    //   <View
    //     style={{
    //       width: '10%',
    //       justifyContent: 'center',
    //     }}>
    //     <Image
    //       source={icons.checkSolid}
    //       style={{
    //         width: normalize(24),
    //         height: normalize(24),
    //       }}
    //     />
    //   </View>
    //   <View
    //     style={{
    //       width: '90%',
    //       paddingLeft: 6,
    //       justifyContent: 'center',
    //     }}>
    //     <Text style={{...text1Style}}>{text1}</Text>
    //     <Text style={{...text2Style}}>{text2}</Text>
    //   </View>
    // </View>
  ),
  registerFailed: ({onPress, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgFailed}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.closecircle}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>ท่านยืนยันตัวตนไม่สำเร็จ</Text>
            <Text style={styles.info}>โปรดติดต่อเจ้าหน้าที่</Text>
            <Text style={styles.info}>โทร {callCenterDash()}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
          <View />
        </View>
      </View>
    </TouchableOpacity>
  ),
  droneFirstTimeFailed: ({onPress, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgFailed}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.closecircle}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>โดรนของท่านไม่ผ่านการยืนยัน</Text>
            <Text style={styles.info}>โปรดติดต่อเจ้าหน้าที่</Text>
            <Text style={styles.info}>โทร {callCenterDash()}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  droneSuccess: ({onPress, text1, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgSuccess}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.success}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>โดรนของท่าน หมายเลขตัวถัง</Text>
            <Text style={styles.info}>{text1}</Text>
            <Text style={styles.info}>ได้รับการตรวจสอบแล้ว</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  droneFailed: ({onPress, text1, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgdroneFailed}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.closecircle}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>โดรนของท่าน หมายเลขตัวถัง</Text>
            <Text style={styles.info}>{text1}</Text>
            <Text style={styles.info}>ได้รับการตรวจสอบแล้ว</Text>
            <Text style={styles.infolight}>
              โปรดติดต่อเจ้าหน้าที่เพื่อดำเนินการ
            </Text>
            <Text style={styles.infolight}>โทร {callCenterDash()}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskSuccess: ({onPress, text1, text2, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgSuccess}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.success}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>งาน {text1}</Text>
            <Text style={styles.info}>{text2}</Text>
            <Text style={styles.info}>ถูกรับแล้ว</Text>
            <Text style={styles.infolight}>
              อย่าลืมติดต่อหาเกษตรกรก่อนเริ่มงาน
            </Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskFailed: ({onPress, text1, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgFailed}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.closecircle}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>{text1}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskWarningContactFarmer: ({onPress, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgWarning}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.warning}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>กรุณาติดต่อเกษตรกร</Text>
            <Text style={styles.info}>เพื่อรับรายละเอียดของงาน</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskWarningContactFarmerTowmorow: ({onPress, text1, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgWarning}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.warning}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>แจ้งเตือน</Text>
            <Text style={styles.info}>รายการงานของท่านในวันพรุ่งนี้</Text>
            <Text style={styles.info}>{text1}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskWarningBeforeOneHours: ({onPress, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgWarning}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.warning}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>งานของท่านกำลังจะเริ่มขึ้นในอีก</Text>
            <Text style={styles.info}>1 ชั่วโมง กรุณาติดต่อเกษตรกร</Text>
            <Text style={[styles.info, {paddingBottom: normalize(5)}]}>
              เพื่อยืนยันสถานะ
            </Text>
            <Text style={styles.infolight}>
              มีคำถามเพิ่มสามารถติดต่อเจ้าหน้าที่
            </Text>
            <Text style={styles.infolight}>โทร {callCenterDash()}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskWarningStartJob: ({onPress, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgWarning}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.warning}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>หากเริ่มงานแล้ว</Text>
            <Text style={styles.info}>อย่าลืมกดปุ่มเริ่มงานด้วยนะคะ</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskWarningJobSuccess: ({onPress, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgWarning}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.warning}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>ท่านยังไม่ได้กดปุ่มงานเสร็จสิ้น</Text>
            <Text style={styles.info}>หากมีปัญหา กรุณาติดต่อเจ้าหน้าที่</Text>
            <Text style={[styles.info, {paddingBottom: normalize(5)}]}>
              ในเวลา 9.00-18.00 น.
            </Text>
            <Text style={styles.infolight}>
              มีคำถามเพิ่มสามารถติดต่อเจ้าหน้าที่
            </Text>
            <Text style={styles.infolight}>โทร {callCenterDash()}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskJobSuccess: ({onPress, text1, text2, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgSuccess}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.success}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>งาน {text1}</Text>
            <Text style={styles.info}>{text2}</Text>
            <Text style={[styles.info, {paddingBottom: normalize(5)}]}>
              ถูกรับแล้ว
            </Text>
            <Text style={styles.infolight}>
              อย่าลืมติดต่อหาเกษตรกรก่อนเริ่มงาน
            </Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskWarningBeforeClose: ({onPress, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgWarning}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.success}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text style={styles.info}>ขออภัยค่ะ</Text>
            <Text style={styles.info}>ท่านกำลังมีงานที่กำลังจะเกิดขึ้น</Text>
            <Text style={[styles.infolight, {paddingBottom: normalize(5)}]}>
              หากมีปัญหากรุณาติดต่อเจ้าหน้าที่ค่ะ
            </Text>
            <Text style={styles.infolight}>โทร. {callCenterDash()}</Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskExtendReqSuccess: ({onPress, text1, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgSuccess}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.success}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: fonts.bold,
                color: colors.white,
                width: 220,
              }}>
              {text1}
            </Text>
            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: fonts.bold,
                color: colors.white,
              }}>
              ขอขยายเวลาแล้ว
            </Text>
            <Text
              style={{
                fontSize: normalize(14),
                fontFamily: fonts.light,
                color: colors.white,
              }}>
              กรุณารอการอนุมัติจากเจ้าหน้าที่
            </Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
  taskExtendSuccess: ({onPress, text1, props}: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.modalBgSuccess}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={icons.success}
            style={{
              width: normalize(30),
              height: normalize(30),
            }}
          />
          <View
            style={{
              paddingLeft: normalize(12),
            }}>
            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: fonts.bold,
                color: colors.white,
                width: 220,
              }}>
              {text1}
            </Text>
            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: fonts.bold,
                color: colors.white,
              }}>
              ขอขยายเวลาแล้ว
            </Text>
            <Text
              style={{
                fontSize: normalize(14),
                fontFamily: fonts.light,
                color: colors.white,
              }}>
              ได้รับอนุมัติจากเจ้าหน้าที่แล้ว
            </Text>
          </View>
        </View>
        <View style={styles.closePosition}>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
            }}>
            <Image
              source={icons.closewhite}
              style={{
                width: normalize(12),
                height: normalize(12),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ),
};

const styles = StyleSheet.create({
  modalBgSuccess: {
    width: responsiveWidth(345),
    borderRadius: responsiveWidth(16),
    backgroundColor: '#3EBD93',
    paddingVertical: responsiveHeigth(15),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  modalBgWarning: {
    width: responsiveWidth(345),
    borderRadius: responsiveWidth(16),
    backgroundColor: '#FF981E',
    paddingVertical: responsiveHeigth(15),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  modalBgFailed: {
    width: responsiveWidth(345),
    borderRadius: responsiveWidth(16),
    backgroundColor: '#EB5757',
    paddingVertical: responsiveHeigth(15),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  modalBgdroneFailed: {
    width: responsiveWidth(345),
    borderRadius: responsiveWidth(16),
    backgroundColor: '#EB5757',
    paddingVertical: responsiveHeigth(15),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  closePosition: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  info: {
    fontSize: normalize(16),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  infolight: {
    fontSize: normalize(14),
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

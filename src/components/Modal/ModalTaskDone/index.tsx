import {View, TouchableOpacity, StyleSheet, Image, Modal} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import * as ImagePicker from 'react-native-image-picker';
import Text from '../../Text';
import {colors, font, icons} from '../../../assets';
import {normalize} from '../../../function/Normalize';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import AsyncButton from '../../Button/AsyncButton';
import ModalImageExample from './ModalImageExample';
import ModalUploadImage from '../ModalUploadImage';

interface Props {
  visible: boolean;
  onOpenModal: () => void;
  onShowReviewModal: (payload: {
    file: any;
    fileDrug: any;
    taskId: string;
  }) => void;
  onClose: () => void;
  taskId: string;
}

const staticData = [
  {
    key: 0,
    title: 'ภาพถ่าย\nหลักฐานการบิน ',
  },
  {
    key: 1,
    title: 'ภาพถ่ายปุ๋ย/ยา',
  },
];
export default function ModalTaskDone({
  visible,
  onClose,
  onOpenModal,
  onShowReviewModal,
  taskId,
}: Props) {
  const [imgController, setImgController] =
    useState<ImagePicker.ImagePickerResponse | null>(null);
  const [imgFertilizer, setImgFertilizer] =
    useState<ImagePicker.ImagePickerResponse | null>(null);
  const [showModalSelectImage, setShowModalSelectImage] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState(0);
  const [demoModal, setDemoModal] = useState(false);

  const onPressToSeeDemo = useCallback(() => {
    onClose();
    setDemoModal(true);
  }, [onClose]);
  const onAddImageController = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 1000,
      maxWidth: 1000,
    });

    if (!result.didCancel) {
      const fileSize = result?.assets?.[0]?.fileSize || 0;
      const isFileMoreThan5MB = fileSize > 5 * 1024 * 1024;
      if (isFileMoreThan5MB) {
        setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 5 MB');
        onOpenModal();
        setStep(() => {
          if (step === 0) {
            return 1;
          }
          return 0;
        });

        return false;
      }

      if (step === 0) {
        setImgController(result);
        setStep(0);
      } else {
        setImgFertilizer(result);
        setStep(1);
      }
      setError('');
      setShowModalSelectImage(false);
      onOpenModal();
    }
  };
  const onTakeImageController = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      maxHeight: 1000,
      maxWidth: 1000,
    });
    if (!result.didCancel) {
      const fileSize = result?.assets?.[0]?.fileSize || 0;
      const isFileMoreThan5MB = fileSize > 5 * 1024 * 1024;
      if (isFileMoreThan5MB) {
        setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 5 MB');
        onOpenModal();
        setStep(() => {
          if (step === 0) {
            return 1;
          }
          return 0;
        });

        return false;
      }

      if (step === 0) {
        setImgController(result);
        setStep(0);
      } else {
        setImgFertilizer(result);
        setStep(1);
      }
      setError('');
      setShowModalSelectImage(false);
      onOpenModal();
    }
  };

  const RenderStep = useMemo(() => {
    if (step === 0) {
      return () => (
        <StepOne
          error={error}
          onPressToSeeDemo={onPressToSeeDemo}
          imgController={imgController}
        />
      );
    }
    return () => <StepTwo imgFertilizer={imgFertilizer} error={error} />;
  }, [step, onPressToSeeDemo, imgController, imgFertilizer, error]);

  const styleButtonCondition =
    step === 0
      ? {
          width: '45%',
          backgroundColor: imgController ? colors.orange : colors.greyWhite,
          borderColor: imgController ? colors.orange : colors.disable,
        }
      : {
          width: '45%',
          backgroundColor: imgFertilizer ? colors.orange : colors.greyWhite,
          borderColor: imgFertilizer ? colors.orange : colors.disable,
        };
  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: 16,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              padding: 16,
              borderRadius: 12,
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: font.semiBold,
                  fontSize: 20,
                  color: 'black',
                  marginBottom: normalize(10),
                }}>
                ยืนยันการเสร็จสิ้นงาน
              </Text>
              <Text style={styles.g19}>กรุณาอัพโหลดภาพ 2 ภาพ ดังนี้</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
                borderBottomColor: colors.disable,
                borderBottomWidth: 1,
              }}>
              {staticData.map((item, index) => {
                const isActive = index === step;
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isActive
                        ? colors.orangeSoft
                        : colors.white,

                      flex: 1,
                      minHeight: 60,
                      paddingHorizontal: 8,

                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}>
                    <View
                      style={{
                        backgroundColor: isActive
                          ? colors.orange
                          : colors.white,
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 8,
                        borderWidth: isActive ? 0 : 1,
                        borderColor: colors.grey3,
                      }}>
                      <Text
                        style={{
                          fontFamily: font.semiBold,
                          fontSize: 18,
                          color: isActive ? colors.white : colors.grey3,
                        }}>
                        {index + 1}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          fontFamily: font.semiBold,
                          fontSize: 16,
                          color: isActive ? colors.orange : colors.grey3,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <RenderStep />

            {step === 1 ? (
              <View style={styles.flexRow}>
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: 'row',
                  }}>
                  {imgFertilizer ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: font.semiBold,
                          fontSize: 14,
                        }}>
                        อัพโหลดภาพปุ๋ย/ยา
                      </Text>
                      <Image
                        source={icons.checkFillSuccess}
                        style={{
                          width: 18,
                          height: 18,
                          marginLeft: 4,
                        }}
                      />
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontFamily: font.semiBold,
                        fontSize: 14,
                      }}>
                      อัพโหลดภาพปุ๋ย/ยา
                    </Text>
                  )}
                </View>
                <AsyncButton
                  onPress={() => {
                    onClose();
                    setShowModalSelectImage(true);
                  }}
                  title={imgFertilizer ? 'เปลี่ยนรูป' : 'เลือกรูป'}
                  style={{
                    flex: 0.3,
                    borderRadius: 30,
                    paddingVertical: 2,
                    paddingHorizontal: 0,
                    minHeight: 46,
                  }}
                  styleText={{
                    fontSize: 16,
                  }}
                />
              </View>
            ) : (
              <View style={styles.flexRow}>
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: 'row',
                  }}>
                  {imgController ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: font.semiBold,
                          fontSize: 14,
                        }}>
                        อัพโหลดภาพหลักฐานการบิน
                      </Text>
                      <Image
                        source={icons.checkFillSuccess}
                        style={{
                          width: 18,
                          height: 18,
                          marginLeft: 4,
                        }}
                      />
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontFamily: font.semiBold,
                        fontSize: 14,
                      }}>
                      อัพโหลดภาพหลักฐานการบิน
                    </Text>
                  )}
                </View>
                <AsyncButton
                  onPress={() => {
                    onClose();
                    setShowModalSelectImage(true);
                  }}
                  title={imgController ? 'เปลี่ยนรูป' : 'เลือกรูป'}
                  style={{
                    flex: 0.3,
                    borderRadius: 30,
                    paddingVertical: 2,
                    paddingHorizontal: 0,
                    minHeight: 46,
                  }}
                  styleText={{
                    fontSize: 16,
                  }}
                />
              </View>
            )}
            <View style={styles.warningGray}>
              <Image
                source={icons.warningBlack}
                style={{
                  width: 18,
                  height: 18,
                }}
              />
              <Text
                style={{
                  color: colors.gray,
                  paddingLeft: 8,
                  fontSize: 12,

                  alignSelf: 'flex-start',
                }}>
                {step === 0
                  ? 'ลักษณะภาพที่อัพโหลดควรแสดงวัน เวลา และจำนวนไร่ของงานที่คุณบินเสร็จในครั้งนี้อย่างชัดเจน'
                  : 'ลักษณะภาพที่อัพโหลดควรเห็นบรรจุภัณฑ์ปุ๋ยหรือยาที่ใช้ในงานครั้งนี้อย่างชัดเจน'}
              </Text>
            </View>
            {/*  bottom */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: normalize(20),
              }}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {borderColor: colors.gray, width: '45%'},
                ]}
                onPress={() => {
                  if (step === 0) {
                    onClose();
                    setImgFertilizer(null);
                    setImgController(null);
                  } else {
                    setStep(step - 1);
                  }
                }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 16,
                    color: 'black',
                  }}>
                  {step === 0 ? 'ยกเลิก' : 'ย้อนกลับ'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styleButtonCondition]}
                onPress={() => {
                  if (imgController && step === 0) {
                    return setStep(1);
                  }
                  if (imgFertilizer && imgController && step === 1) {
                    onClose();
                    onShowReviewModal({
                      file: imgController,

                      fileDrug: imgFertilizer,
                      taskId: taskId,
                    });
                  }
                }}
                disabled={step === 0 ? !imgController : !imgFertilizer}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 16,

                    color: colors.white,
                  }}>
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalImageExample
        visible={demoModal}
        onPressBack={() => {
          setDemoModal(false);
          onOpenModal();
        }}
      />
      <ModalUploadImage
        onCancel={() => {
          setShowModalSelectImage(false);

          onOpenModal();
        }}
        onPressLibrary={() => {
          onAddImageController();
        }}
        onPressCamera={() => {
          onTakeImageController();
        }}
        visible={showModalSelectImage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  uploadFrame: {
    width: normalize(316),
    height: normalize(136),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(16),
  },
  modalBtn: {
    minHeight: 50,
    borderWidth: 0.2,
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  g19: {
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
  },
  warningGray: {
    backgroundColor: colors.grayBg,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

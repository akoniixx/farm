import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import Text from '../../components/Text';
import CustomHeader from '../../components/CustomHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, icons, image} from '../../assets';
import ModalUploadImage from '../../components/Modal/ModalUploadImage';
import * as ImagePicker from 'react-native-image-picker';
import AnimatedInput from '../../components/Input/AnimatedInput';
import AsyncButton from '../../components/Button/AsyncButton';
import {Authentication} from '../../datasource/AuthDatasource';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from '../../components/Modal/Modal';
import {useAuth} from '../../contexts/AuthContext';
import {checkIdCard} from '../../function/utility';

interface Props {
  navigation: any;
}
export default function NewAddIDCardScreen({navigation}: Props) {
  const {
    state: {user},
    authContext: {getProfileAuth},
  } = useAuth();
  const [showModalSelectImage, setShowModalSelectImage] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errorIdCard, setErrorIdCard] = React.useState('');
  const [images, setImages] = React.useState<any>(null);
  const [idCardNumber, setIdCardNumber] = React.useState('');
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isDataChange, setIsDataChange] = React.useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      if (user?.idNo) {
        setIdCardNumber(user?.idNo);
      }
      const filterIDCardImage = user?.file?.find(
        el => el.category === 'ID_CARD_IMAGE',
      );
      if (filterIDCardImage) {
        try {
          setLoading(true);
          const result = await Authentication.getImageUrl(
            filterIDCardImage?.path,
          );
          setImages({
            ...filterIDCardImage,
            uri: result.url,
          });
        } catch (e) {
          console.log('e', e);
        } finally {
          setLoading(false);
        }
      }
    };
    if (user) {
      getInitialData();
    }
  }, [user]);

  const isHaveValue = useMemo(() => {
    const have13Length = idCardNumber && idCardNumber.length >= 13;

    return have13Length && !!images && isDataChange;
  }, [idCardNumber, images, isDataChange]);

  const onSelectImageCard = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      const fileSize = result?.assets?.[0]?.fileSize || 0;
      const isFileMoreThan20MB = fileSize > 20 * 1024 * 1024;
      if (isFileMoreThan20MB) {
        setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB');
        return false;
      }
      setError('');
      setShowModalSelectImage(false);
      setIsDataChange(true);
      setImages(result?.assets?.[0]);
      setIsDataChange(true);
    }
  };
  const onTakeImage = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      maxHeight: 1000,
      maxWidth: 1000,
      cameraType: 'back',
      quality: 0.8,
    });
    if (!result.didCancel) {
      const fileSize = result?.assets?.[0]?.fileSize || 0;
      const isFileMoreThan20MB = fileSize > 20 * 1024 * 1024;

      if (isFileMoreThan20MB) {
        setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB');

        return false;
      }

      setError('');
      setShowModalSelectImage(false);
      setImages(result?.assets?.[0]);
      setIsDataChange(true);
    }
  };

  const onFinishedTakePhoto = useCallback(async (v: any) => {
    const isFileMoreThan20MB = v.fileSize > 20 * 1024 * 1024;
    if (isFileMoreThan20MB) {
      setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB');

      return false;
    }
    setImages(v?.assets?.[0]);
    setError('');
    setShowModalSelectImage(false);
    setIsDataChange(true);
  }, []);

  const onFinish = async () => {
    try {
      const {isValid: isValidIdCard, message} = checkIdCard(idCardNumber);
      if (!isValidIdCard) {
        return setErrorIdCard(message);
      }
      const imageNotChange = Object.keys(images).includes('path');
      const listPromise = imageNotChange
        ? [Authentication.updateIDCardNumber(idCardNumber)]
        : [
            Authentication.uploadDronerIDCard(images),
            Authentication.updateIDCardNumber(idCardNumber),
          ];
      setLoading(true);

      await Promise.all(listPromise)
        .then(() => {
          setUpdateSuccess(true);
          setLoading(false);
        })
        .catch(e => {
          console.log('e', e);
        })
        .finally(async () => {
          setLoading(false);
          await getProfileAuth();
        });
    } catch (e) {
      console.log('e', e);
    }
  };
  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
      }}>
      <CustomHeader
        showBackBtn
        title={'เพิ่มรูปคู่บัตรประชาขน'}
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 16,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: font.medium,
                }}>
                ตัวอย่างรูปถ่ายคู่ผู้สมัครพร้อมบัตรประชาชน
              </Text>

              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={image.idCardExample}
                  resizeMode="contain"
                  style={{
                    width: '60%',
                    height: 200,
                    marginVertical: 16,
                  }}
                />
                <Text
                  style={{
                    color: colors.gray,
                  }}>
                  กรุณาถ่ายหน้าตรง{' '}
                </Text>
                <Text
                  style={{
                    color: colors.gray,
                  }}>
                  พร้อมถือบัตรประชาชนของคุณโดยให้เห็นใบหน้า
                </Text>
                <Text
                  style={{
                    color: colors.gray,
                  }}>
                  และบัตรประชาชนอย่างชัดเจน
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: font.medium,
                  textAlign: 'left',
                  marginTop: 16,
                }}>
                อัพโหลดรูปถ่ายผู้สมัคร คู่บัตรประชาชน
              </Text>
              <ImageBackground
                style={styles({isHavePic: !!images}).card}
                imageStyle={{
                  borderRadius: 12,
                }}
                source={
                  images && {
                    uri: images?.uri,
                  }
                }>
                {!images ? (
                  <TouchableOpacity
                    style={styles({isHavePic: false}).button}
                    onPress={() => {
                      setShowModalSelectImage(true);
                    }}>
                    <Image
                      source={icons.camera}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles({isHavePic: !!images}).button}
                      onPress={() => {
                        setShowModalSelectImage(true);
                      }}>
                      <Text>เปลี่ยนรูป</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ImageBackground>
              {error.length > 0 && (
                <Text
                  style={{
                    marginTop: 8,
                    color: colors.decreasePoint,
                  }}>
                  {error}
                </Text>
              )}

              <AnimatedInput
                maxLength={13}
                label="เลขบัตรประชาชน"
                value={idCardNumber}
                style={{
                  marginTop: 16,
                  borderRadius: 10,
                  marginBottom: 4,
                }}
                stylesInput={{
                  borderRadius: 10,
                  marginBottom: 0,
                }}
                onChangeText={v => {
                  setIsDataChange(true);
                  setIdCardNumber(v);
                  setErrorIdCard('');
                }}
                keyboardType="number-pad"
              />
              <Text
                style={{
                  color: colors.gray,
                }}>
                ใส่เลข 13 หลักบนบัตรโดยไม่ต้องเว้นวรรค
              </Text>
              {errorIdCard.length > 0 && (
                <Text
                  style={{
                    marginTop: 8,
                    color: colors.decreasePoint,
                  }}>
                  {errorIdCard}
                </Text>
              )}
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <AsyncButton
                disabled={!isHaveValue}
                title="บันทึก"
                onPress={() => {
                  onFinish();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalUploadImage
        visible={showModalSelectImage}
        onCancel={() => {
          setShowModalSelectImage(false);
        }}
        onCloseModalSelect={() => {
          setShowModalSelectImage(false);
        }}
        onFinishedTakePhoto={onFinishedTakePhoto}
        onPressCamera={onTakeImage}
        onPressLibrary={onSelectImageCard}
      />
      <Modal
        visible={updateSuccess}
        onClose={() => {
          setUpdateSuccess(false);
        }}>
        <View
          style={{
            padding: 16,
            backgroundColor: colors.white,
            width: '100%',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={image.imageUploadIDCardDone}
            style={{
              width: 110,
              height: 110,
            }}
          />
          <Text
            style={{
              fontFamily: font.semiBold,
              fontSize: 20,
              marginVertical: 16,
            }}>
            เพิ่มรูปถ่ายคู่บัตรประชาชนสำเร็จ
          </Text>
          <AsyncButton
            title="ตกลง"
            onPress={async () => {
              try {
                setUpdateSuccess(false);
                navigation.goBack();
              } catch (err) {
                console.log('err', err);
              }
            }}
          />
        </View>
      </Modal>
      <Spinner
        visible={loading}
        textContent="...Loading"
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
}
const styles = ({isHavePic}: {isHavePic?: boolean}) =>
  StyleSheet.create({
    card: {
      backgroundColor: '#FAFAFB',
      height: 162,
      marginTop: 16,
      borderRadius: 10,
      borderWidth: 1,
      justifyContent: isHavePic ? 'flex-start' : 'center',
      alignItems: isHavePic ? 'flex-start' : 'center',
      borderColor: '#E5E5E5',
    },
    button: {
      borderRadius: 12,
      marginTop: isHavePic ? 8 : 0,
      marginLeft: isHavePic ? 8 : 0,

      shadowColor: '#1D3A58',
      shadowOffset: {
        width: 4,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 5,
      backgroundColor: colors.white,
      padding: isHavePic ? 10 : 16,
    },
  });

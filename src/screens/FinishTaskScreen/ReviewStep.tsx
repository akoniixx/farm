import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import CustomHeader from '../../components/CustomHeader';
import {colors, font, icons} from '../../assets';
import {normalize} from '../../function/Normalize';
import AsyncButton from '../../components/Button/AsyncButton';
import {mixpanel} from '../../../mixpanel';
import TextInputArea from '../../components/TextInputArea/TextInputArea';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';

interface Props {
  onPressBack: () => void;
  onSubmit: (payload: {rating: number; comment: string}) => Promise<void>;
  navigation: StackNavigationProp<StackParamList, 'FinishTaskScreen'>;
  taskId: string;
  isFromTaskDetail: boolean;
}
export default function StepThree({
  onPressBack,
  onSubmit,
  navigation,
  taskId,
  isFromTaskDetail,
}: Props) {
  const [rating, setRating] = React.useState(0);
  const [isFocus, setIsFocus] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const onSubmitFinishTask = async () => {
    try {
      setLoading(true);
      await onSubmit({
        rating,
        comment,
      }).then(() => {
        setLoading(false);
        navigation.navigate('TaskDetailScreen', {
          taskId: taskId,
          isFinishTask: true,
          isFromTaskDetail: isFromTaskDetail,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <CustomHeader
        title={'รีวิวเกษตรกร'}
        onPressBack={onPressBack}
        showBackBtn
      />
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          borderRadius: 12,
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: normalize(16),
              color: 'black',
              marginBottom: 12,
            }}>
            ภาพรวมของเกษตรกร
          </Text>
          <ReviewBar rating={rating} setRating={setRating} />
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: normalize(16),
              color: 'black',
            }}>
            ความคิดเห็นเพิ่มเติม
          </Text>
          <View
            style={{
              position: 'relative',
            }}>
            {comment.length < 1 && (
              <Text
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 10,
                  fontFamily: font.light,
                  color: colors.grey40,
                  fontSize: 14,
                }}>
                กรอกความคิดเห็นเพิ่มเติม
              </Text>
            )}
            <TextInputArea
              style={{
                borderWidth: 1,
                borderRadius: normalize(8),
                borderColor: isFocus ? colors.orange : colors.greyWhite,
                padding: normalize(10),
                minHeight: normalize(100),
                marginBottom: normalize(8),
              }}
              onChangeText={setComment}
              value={comment}
            />
          </View>
        </View>

        <AsyncButton
          title="ยืนยัน"
          isLoading={loading}
          disabled={rating == 0 || loading}
          onPress={onSubmitFinishTask}
        />
      </View>
    </>
  );
}
const ReviewBar = ({
  rating,
  setRating,
}: {
  setRating: (value: number) => void;
  rating: number;
}) => {
  const maxRatting = [1, 2, 3, 4, 5];
  return (
    <View style={styles.reviewBar}>
      {maxRatting.map((item, key) => {
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            key={key}
            onPress={() => setRating(item)}>
            <Image
              style={styles.star}
              source={item <= rating ? icons.starfill : icons.starCorner}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  reviewBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
    paddingHorizontal: 8,
    width: '100%',
  },
  star: {
    width: normalize(36),
    height: normalize(36),
    marginHorizontal: normalize(5),
  },
});

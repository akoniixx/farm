import React, {useEffect} from 'react';
import {normalize} from '@rneui/themed';
import fonts from '../../assets/fonts';
import {colors, image, icons, font} from '../../assets';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {getStatusToText, numberWithCommas} from '../../function/utility';
import * as RootNavigation from '../../navigations/RootNavigation';
import {SheetManager} from 'react-native-actions-sheet';

const MainTasklists: React.FC<any> = (props: any) => {
  const date = new Date(props.date);
  const today = new Date();
  const ratting = [1, 2, 3, 4, 5];
  const finishDate = new Date(
    props.finishTime.length ? props.finishTime[0].createdAt : null,
  );
  console.log(finishDate);

  return (
    <View style={styles.taskMenu}>
      <View style={styles.listTile}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: normalize(14),
            color: '#9BA1A8',
          }}>
          #{props.id}
        </Text>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: getStatusToText(props.status)?.bgcolor,
            paddingHorizontal: normalize(12),
            paddingVertical: normalize(5),
            borderRadius: normalize(12),
          }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: getStatusToText(props.status)?.color,
              fontSize: normalize(12),
            }}>
            {getStatusToText(props.status)?.label}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          RootNavigation.navigate('Main', {
            screen: 'TaskDetailScreen',
            params: {taskId: props.taskId},
          })
        }>
        <View style={styles.listTile}>
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: fonts.medium,
              fontSize: normalize(19),
            }}>
            {`${props.title} | ${props.farmArea} ไร่`}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: '#2EC66E',
              fontSize: normalize(17),
            }}>
            ฿ {props.price ? numberWithCommas(props.price) : null}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: normalize(5),
          }}>
          <Image
            source={icons.jobCard}
            style={{
              width: normalize(20),
              height: normalize(20),
            }}
          />
          <Text
            style={{
              fontFamily: fonts.medium,
              paddingLeft: normalize(8),
              fontSize: normalize(14),
              color: colors.fontBlack,
            }}>{`${date.getDate()}/${date.getMonth() + 1}/${
            date.getFullYear() + 543
          },${date.getHours()}:${date.getMinutes()} น.`}</Text>
        </View>

        {props.status === 'WAIT_REVIEW' || props.status === 'DONE' ? (
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              paddingVertical: normalize(5),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: normalize(12),
                  color: '#3EBD93',
                }}>
                งานเสร็จเมื่อ{' '}
              </Text>
              <Text
                style={{
                  fontFamily: font.light,
                  fontSize: normalize(12),
                  color: 'black',
                }}>{`${finishDate.getDate()}/${finishDate.getMonth() + 1}/${
                finishDate.getFullYear() + 543
              } ${finishDate.getHours()}:${finishDate.getMinutes()} น.`}</Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingVertical: normalize(5),
            }}>
            <Image
              source={icons.jobDistance}
              style={{
                width: normalize(20),
                height: normalize(20),
              }}
            />
            <View
              style={{
                paddingLeft: normalize(8),
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  color: colors.fontBlack,
                  fontSize: normalize(14),
                }}>
                {props.address}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  color: '#9BA1A8',
                  fontSize: normalize(13),
                }}>
                ระยะทาง {props.distance} กม.
              </Text>
            </View>
          </View>
        )}

        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: normalize(5),
          }}>
          <Image
            source={
              typeof props.img !== 'string' ? icons.account : {uri: props.img}
            }
            style={{
              width: normalize(20),
              height: normalize(20),
            }}
          />
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: fonts.medium,
              paddingLeft: normalize(8),
              fontSize: normalize(14),
            }}>
            {props.user}
          </Text>
        </View>
      </TouchableOpacity>

      {props.status === 'WAIT_REVIEW' ? (
        <View style={styles.borderReview}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: normalize(14),
              color: 'black',
            }}>
            รอเกษตรกรรีวิว
          </Text>
          <View style={{flexDirection: 'row'}}>
            {ratting.map(i => (
              <Image
                key={i}
                source={icons.starBorder}
                style={{
                  width: normalize(15),
                  height: 15,
                  marginHorizontal: normalize(2),
                }}
              />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  taskMenu: {
    backgroundColor: '#fff',
    padding: normalize(15),
    marginVertical: normalize(5),
  },
  listTile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  borderReview: {
    height: normalize(48),
    borderWidth: 1,
    borderColor: colors.greyWhite,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(10),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
  },
});

export default MainTasklists;

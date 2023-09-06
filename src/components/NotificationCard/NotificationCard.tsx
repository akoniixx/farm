import { View, StyleSheet, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import {
  NotificationCardEntity,
  NotificationType,
} from '../../entites/NotificationCard';
import { normalize, width } from '../../functions/Normalize';
import { colors, font, icons } from '../../assets';
import Text from '../Text/Text';

function iconType(type: NotificationType) {
  switch (type) {
    case NotificationType.NEWS:
      return icons.iconnews;
    case NotificationType.PROMOTIONS:
      return icons.iconpromotion;
    case NotificationType.TASK:
      return icons.icontask;
    default:
      return icons.iconverify;
  }
}

const NotificationCard: React.FC<NotificationCardEntity> = prop => {
  const [expand, setExpand] = useState(false);
  return (
    <Pressable onPress={prop.onClick}>
      <View
        style={[
          style.body,
          { backgroundColor: prop.isRead ? colors.white : '#F7FFF0' },
        ]}>
        <View style={style.viewIcon}>
          <Image source={iconType(prop.notificationType)} style={style.icon} />
        </View>
        <View style={style.viewBody}>
          <View style={style.header}>
            <Text style={style.headerText}>{prop.title}</Text>
            <Pressable onPress={() => setExpand(!expand)}>
              <Image
                source={expand ? icons.arrowUp : icons.arrowDown}
                style={style.arrow}
              />
            </Pressable>
          </View>
          {expand ? (
            <Text style={style.subtitleText}>{prop.subtitle}</Text>
          ) : (
            <Text style={style.subtitleText} numberOfLines={1}>
              {prop.subtitle}
            </Text>
          )}
          <Text style={style.dateText}>{prop.dateString}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default NotificationCard;

const style = StyleSheet.create({
  body: {
    width: width,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(30),
    flexDirection: 'row',
  },
  viewIcon: {
    flex: 1,
    paddingRight: normalize(15),
  },
  viewBody: {
    flex: 8,
  },
  icon: {
    width: normalize(36),
    height: normalize(36),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrow: {
    width: normalize(18),
    height: normalize(18),
  },
  headerText: {
    fontFamily: font.AnuphanMedium,
    fontWeight: '600',
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  subtitleText: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.grey60,
  },
  dateText: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(14),
    paddingTop: normalize(10),
    color: colors.grey40,
  },
});

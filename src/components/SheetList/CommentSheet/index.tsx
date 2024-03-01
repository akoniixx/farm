import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import colors from '../../../assets/colors/colors';
import { font, icons } from '../../../assets';
import Text from '../../Text/Text';
import EmptyComment from './EmptyComment';
import { MentionInput } from 'react-native-controlled-mentions';
import RenderSuggestions from './RenderSuggestions';

export interface CommentSheetProps {
  commentCount: number;
}

const mockSuggestions = [
  { id: '1', name: 'David Tabaka' },
  { id: '2', name: 'Mary' },
  { id: '3', name: 'Tony' },
  { id: '4', name: 'Mike' },
  { id: '5', name: 'Grey' },
];
export default function CommentSheet({ sheetId, payload }: SheetProps) {
  const { commentCount }: CommentSheetProps = payload;
  const [commentText, setCommentText] = React.useState('');
  const widthAnim = useRef(new Animated.Value(0)).current; // Initial value for width

  const refInput = React.useRef<any>(null);

  const onCloseSheet = () => {
    SheetManager.hide(sheetId);
  };
  const onPressEmptyComment = () => {
    if (refInput.current) {
      refInput.current.focus();
    }
  };
  const onClearText = () => {
    setCommentText('');
  };
  const onChangeText = (value: string) => {
    const startWithSpace = value.startsWith(' ');
    if (startWithSpace) {
      refInput.current.setNativeProps({
        text: value.trimStart(),
      });
      setCommentText(value.trimStart());
      return;
    }

    setCommentText(value);
  };

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: commentText.length > 0 ? 30 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [commentText, widthAnim]);

  const interpolatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '28%'],
  });
  return (
    <ActionSheet
      id={sheetId}
      onClose={() => {
        SheetManager.hide(sheetId);
      }}
      containerStyle={{
        height: '100%',
      }}>
      <View style={styles().container}>
        <View style={styles().header}>
          <Text style={styles().commentTitle}>
            ความคิดเห็น
            {commentCount === 0 ? null : (
              <Text style={styles().commentCount}>{`  ${commentCount}`}</Text>
            )}
          </Text>
          <TouchableOpacity onPress={onCloseSheet}>
            <Text style={styles().closeText}>ปิด</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          renderItem={[]}
          ListEmptyComponent={() => {
            return <EmptyComment onPressEmptyComment={onPressEmptyComment} />;
          }}
        />
        <View style={styles().footer}>
          <View style={styles().mentionContainer}>
            <MentionInput
              inputRef={refInput}
              onChange={onChangeText}
              partTypes={[
                {
                  trigger: '@',
                  renderSuggestions: props => {
                    return (
                      <RenderSuggestions
                        {...props}
                        suggestionLists={mockSuggestions}
                      />
                    );
                  },
                  textStyle: {
                    color: colors.greenLight,
                    fontFamily: font.AnuphanSemiBold,
                  },
                  isInsertSpaceAfterMention: true,
                },
              ]}
              value={commentText}
              onSelectionChange={() => {}}
              style={styles().mentionInput}
              placeholder="เพิ่มความคิดเห็น..."
              placeholderTextColor={colors.grey30}
            />
            {commentText.length > 0 ? (
              <TouchableOpacity
                style={styles().clearButton}
                onPress={onClearText}>
                <Image source={icons.closeIcon} style={styles().clearImage} />
              </TouchableOpacity>
            ) : null}
          </View>
          {commentText.length > 0 ? (
            <View
              style={{
                width: 8,
              }}
            />
          ) : null}
          <Animated.View
            style={{
              width: interpolatedWidth,
              opacity: commentText.length > 0 ? 1 : 0,
            }}>
            <TouchableOpacity>
              <Image source={icons.sendCommentIcon} style={styles().sendIcon} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ActionSheet>
  );
}
const styles = (props?: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 16,
      borderBottomWidth: 1,
      borderColor: colors.grey5,
      paddingBottom: 8,
      paddingHorizontal: 16,
    },
    content: {
      flex: 1,
    },

    closeText: {
      color: colors.greenLight,
      fontSize: 18,
      fontFamily: font.SarabunRegular,
    },
    commentTitle: {
      fontSize: 22,
      color: colors.fontBlack,
      fontFamily: font.AnuphanSemiBold,
    },
    commentCount: {
      fontSize: 14,
      color: colors.grey40,
    },
    footer: {
      paddingVertical: 16,
      backgroundColor: colors.white,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#242D35',
      shadowOffset: {
        width: 0,
        height: -8,
      },
      shadowOpacity: 0.04,
      shadowRadius: 16,
      marginBottom: 24,
      paddingHorizontal: 16,
      width: '100%',
    },
    mentionContainer: {
      position: 'relative',
      flex: 1,
    },
    mentionInput: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: colors.grey30,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 18,
      textAlignVertical: 'center',
      alignItems: 'center',
      minHeight: 52,
      paddingTop: 14,
      paddingBottom: 14,
      maxHeight: 140,
    },
    clearButton: {
      position: 'absolute',
      right: 16,
      top: 18,
    },
    clearImage: {
      width: 18,
      height: 18,
    },
    sendIcon: {
      width: 24,
      height: 24,
    },
  });

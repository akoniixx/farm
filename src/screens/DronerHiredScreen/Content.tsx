import { View, FlatList } from 'react-native';
import React from 'react';
import { DronerHired } from '.';
import DronerItem from './DronerItem';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '../../assets';
import { RefreshControl } from 'react-native-gesture-handler';
import LoadingPagination from '../../components/LoadingPagination/LoadingPagination';
import EmptyDronerList from './EmptyDronerList';

interface Props {
  data: {
    count: number;
    data: Array<DronerHired>;
  };
  loading: boolean;
  setData: React.Dispatch<
    React.SetStateAction<{
      count: number;
      data: Array<DronerHired>;
    }>
  >;
  getDronerHiredList: () => Promise<void>;
  navigation: any;
  loadMore: () => Promise<void>;
}
export default function Content({
  data,
  loading,
  getDronerHiredList,
  setData,
  navigation,
  loadMore,
}: Props) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const fetchRef = React.useRef(false);
  const onEndReached = async () => {
    try {
      if (fetchRef.current) {
        return;
      }
      fetchRef.current = true;
      setLoadingMore(true);
      await loadMore();
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMore(false);
      fetchRef.current = false;
    }
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getDronerHiredList();
    setRefreshing(false);
  }, [getDronerHiredList]);
  return (
    <>
      {loading ? (
        <View
          style={{
            padding: 16,
          }}>
          <SkeletonPlaceholder speed={2000} backgroundColor={colors.skeleton}>
            <>
              {Array.from(Array(5).keys()).map((_, index) => {
                return (
                  <SkeletonPlaceholder.Item
                    key={index}
                    borderRadius={8}
                    marginBottom={16}
                    height={128}
                    width={'100%'}
                  />
                );
              })}
            </>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<EmptyDronerList />}
          scrollEnabled={loadingMore ? false : true}
          data={data.data}
          contentContainerStyle={{
            padding: 16,
          }}
          onEndReached={onEndReached}
          renderItem={({ item }) => {
            return (
              <DronerItem
                {...item}
                setData={setData}
                navigation={navigation}
                favorite_status={
                  item.favorite_status
                    ? item.favorite_status
                    : item.status_favorite
                }
              />
            );
          }}
          ListFooterComponent={loadingMore ? <LoadingPagination /> : null}
          keyExtractor={(item, index) =>
            `${index}_${item.droner_id}_${Math.random()}`
          }
        />
      )}
    </>
  );
}

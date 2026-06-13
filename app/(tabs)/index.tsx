import { ListHeading } from '@/components/ListHeading';
import SubscriptionCard from '@/components/SubscriptionCard';
import UpcomingSucscriptions from '@/components/UpcomingSucscriptions';
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from '@/constants/data';
import { icons } from '@/constants/icons';
import images from '@/constants/images';
import '@/global.css';
import { formatCurrency } from '@/lib/utils';
import dayjs from 'dayjs';
import { styled } from 'nativewind';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] =
    useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-5">
      <View className="mx-2 flex-1">
        <FlatList
          className="flex-1"
          data={HOME_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <>
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={images.avatar}
                    className="w-12 h-12 rounded-full border border-gray-200"
                    resizeMode="cover"
                  />

                  <View>
                    <Text className="text-xs text-gray-500 font-medium">
                      Welcome back
                    </Text>

                    <Text className="text-lg font-semibold text-gray-900">
                      {HOME_USER.name}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.75}
                  className="w-11 h-11 rounded-full bg-white items-center justify-center shadow-sm border border-gray-100"
                >
                  <Image
                    source={icons.add}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Balance Card */}
              <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>

                <View className="home-balance-row">
                  <Text className="home-balance-amount">
                    {formatCurrency(HOME_BALANCE.amount)}
                  </Text>

                  <Text className="home-balance-date">
                    {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                  </Text>
                </View>
              </View>

              {/* Upcoming Section */}
              <View>
                <ListHeading title="Upcoming" />

                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  renderItem={({ item }) => (
                    <UpcomingSucscriptions {...item} />
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text className="home-empty-state">
                      No upcoming renewals yet.
                    </Text>
                  }
                />
              </View>

              {/* Subscriptions Heading */}
              <View>
                <ListHeading title="Subscriptions" />
              </View>
            </>
          )}
          renderItem={({ item }) => (
            <SubscriptionCard
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId(
                  expandedSubscriptionId === item.id ? null : item.id
                )
              }
              {...item}
            />
          )}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 24,
          }}
          ListEmptyComponent={
            <Text className="home-empty-state">
              No active subscriptions yet.
            </Text>
          }
          contentContainerStyle={{
            paddingBottom: 80,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

import { ListHeading } from '@/assets/ListHeading';
import UpcomingSucscriptions from '@/assets/UpcomingSucscriptions';
import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from '@/constants/data';
import { icons } from '@/constants/icons';
import images from '@/constants/images';
import '@/global.css';
import { formatCurrency } from '@/lib/utils';
import dayjs from 'dayjs';
import { styled } from 'nativewind';
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
  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-5 ">
      <View className=" flex-row items-center justify-between mb-6 mx-2">
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

      <View className='home-balance-card mx-2'>
        <Text className='home-balance-label'>Balance</Text>
        <View className='home-balance-row'>
          <Text className='home-balance-amount'>
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>           
          <Text className='home-balance-date'>
            {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
          </Text>
        </View>
      </View>

      <View className='mx-2'>
        <ListHeading title="Upcoming"/>
        <FlatList data={UPCOMING_SUBSCRIPTIONS} renderItem={({item}) => {
          return <UpcomingSucscriptions {...item} />;
        }} 
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text className='home-empty-state'>No upcoming renewals yet.</Text>}
        />
      </View>

      <View>
        <ListHeading title="Subscriptions"/>
      </View>

    </SafeAreaView>
  );
}
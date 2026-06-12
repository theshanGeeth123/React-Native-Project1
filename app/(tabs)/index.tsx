import '@/global.css';
import { Link } from 'expo-router';
import { styled } from 'nativewind';
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
const SafeAreaView = styled(RNSafeAreaView);
 
export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-sans-extrabold text-primary">
        Home
      </Text>
      <Text className="text-7xl font-bold text-primary">
        Home
      </Text>
      <Link href="/(auth)/signIn" className='bg-black text-white py-2 px-2 rounded-md mt-4'>
        <Text className='font-sans-bold'>Go to SignIn</Text>
      </Link>
      <Link href="/(auth)/signUp" className='bg-black text-white py-2 px-2 rounded-md mt-4'>
        <Text className='font-sans-bold'>Go to SignUp</Text>
      </Link>

    </SafeAreaView>
  );
}
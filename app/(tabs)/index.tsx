import '@/global.css';
import { Link } from 'expo-router';
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center  bg-background">
      <Text className="text-xl font-bold  text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/(auth)/signIn" className='bg-black text-white py-2 px-2 rounded-md mt-4'>
        <Text >Go to SignIn</Text>
      </Link>
      <Link href="/(auth)/signUp" className='bg-black text-white py-2 px-2 rounded-md mt-4'>
        <Text >Go to SignUp</Text>
      </Link>

      <Link href="/subscriptions/spotify">Spotify Subscription</Link>
      <Link
        href={{
          pathname: '/subscriptions/[id]',
          params: { id: 'claude-max' },
        }}
      >Claude Max Subscription</Link>
    </View>
  );
}
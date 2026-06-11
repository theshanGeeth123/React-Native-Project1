import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const signIn = () => {
  return (
    <View>
      <Text>signIn</Text>
      <Link href="/(auth)/signUp">Create Account</Link>
    </View>
  )
}

export default signIn
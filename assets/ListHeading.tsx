import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const ListHeading = ({ title }: ListHeadingProps) => {
  return (
    <View className='list-head mx-2'>
      <Text className='list-title'>{title}</Text>

      <TouchableOpacity className='list-action '>
        <Text className='list-action-text'>View All</Text>
      </TouchableOpacity>
    </View>


  )
}


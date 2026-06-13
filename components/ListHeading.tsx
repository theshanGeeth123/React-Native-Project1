import React from 'react';
import { Pressable, Text, View } from 'react-native';

export const ListHeading = ({ title, actionLabel = 'View all', onPress }: ListHeadingProps) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      {onPress ? (
        <Pressable accessibilityRole="button" className="list-action" onPress={onPress}>
          <Text className="list-action-text">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

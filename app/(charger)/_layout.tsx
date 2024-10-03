import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ChargerLayout = () => {
    return (
      <Stack>
        <Stack.Screen name="reviewForm" options={{ headerShown: false}} />
        <Stack.Screen name="charging-session" options={{ headerShown: false}} />

      </Stack>
      )
}

export default ChargerLayout
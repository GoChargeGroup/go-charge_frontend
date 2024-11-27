import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading, picture}) => {
  return (
    <TouchableOpacity
    onPress={handlePress}
    activeOpacity={0.7} 
    className={`w-11/12 p-4 mb-3 bg-blue-100 rounded-2xl flex-row justify-center items-center ${containerStyles} 
    ${isLoading ? 'opacity-50' : ''}`}
    disabled={isLoading} 
    >
        {picture && <Image source={picture} className="w-4 h-5 mr-2" />}
        <Text className={`text-lg text-green-200 font-sfbold ${textStyles}`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton
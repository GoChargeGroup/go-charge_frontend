import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import {icons} from '../constants'
const FormField = ({title, value, placeholder, handleChangeText, otherStyles, textStyles, formStyles, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium"></Text>
      <View className={`w-full h-16 px-4 bg-white  focus:border-secondary items-center flex-row ${formStyles}`}>
        <TextInput
            className={`flex-1 text-black font-sfregular text-base ${textStyles}`}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title==='Password' && !showPassword}
            multiline={title !== 'Password'} // Enable multiline for non-password fields
            textAlignVertical="top" // Ensure text starts at the top
            blurOnSubmit={true} // Dismiss keyboard on return key
            onSubmitEditing={props.onSubmitEditing} // Handle return key
            {...props}
        />
        {title === 'Password' && <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}> 
        <Image source={!showPassword ? icons.eye : icons.eyeHide }className="w-6 h-6" resizeMode="contain"/>
        </TouchableOpacity>}
      </View>
    </View>
  )
}

export default FormField
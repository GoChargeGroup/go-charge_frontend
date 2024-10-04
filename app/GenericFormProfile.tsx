import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import CustomButton from '@/components/CustomButton';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useGlobalContext } from '@/context/GlobalProvider';
import { editUser } from '@/lib/authService';

const GenericFormProfile = () => {
  const navigation = useNavigation();
  const { setUser, user } = useGlobalContext();
  const route = useRoute();
  const { fieldName, fieldValue, userId, displayName} = route.params;
  const [value, setValue] = useState(fieldValue);
  
  const handleSave = async () => {
    if(verifyInput()) {
      try {
          const updatedData = {
              username: user.username, 
              email: user.email, 
              [fieldName]: value, 
            };
            console.log(updatedData);
        if(fieldName === "email") updatedData[fieldName] = value.toLowerCase();
        const updatedUser = await editUser(userId, updatedData);
        setUser(updatedUser);
      //   setUser((prevUser) => ({
      //     ...prevUser,
      //     [fieldName]: value,
      //   }));
        Alert.alert('Success', `${fieldName} updated successfully`);
        navigation.goBack();
      } catch (error) {
        console.error('Failed to update user profile:', error);
        Alert.alert('Error', `Failed to update ${fieldName}`);
      }
    }
  };
  function verifyInput() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    switch(fieldName) {
      case ("username"):
        if (value.includes(' ')) {
          Alert.alert("Error", "Username cannot contain spaces");
          return false;
        } else return true;
      case("email"):
        if (!emailRegex.test(value)) {
          Alert.alert("Error", "Email is invalid");
          return false;
        } else return true;
      default: 
        return true;
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-customWhite-200 h-full ">
        <View className="flex-row items-center mb-6 px-4 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-14">
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-sfbold ml-2">Enter New {displayName}</Text>
        </View>
        <ScrollView>
          <View className="w-full  min-h-[80vh] px-4 my-6">
            <TextInput
              className="border p-2 rounded-lg mb-4"
              placeholder={`Enter ${fieldName}`}
              value={value}
              onChangeText={setValue}
            />
            <CustomButton
              title="Save"
              handlePress={handleSave}
              containerStyles="mt-7 w-full"
              textStyles=""
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default GenericFormProfile;

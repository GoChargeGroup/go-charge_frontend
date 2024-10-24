import { View, Text, TouchableOpacity, Image, Switch, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { icons } from '@/constants';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import { deleteUser, logout } from '@/lib/authService';

const Profile = () => {
  const { user, setUser, setIsLoggedIn, isLoading } = useGlobalContext();
  const [carChargingNotifications, setCarChargingNotifications] = useState(true);
  const [promotionsNotifications, setPromotionsNotifications] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    if (!user && !isLoading) {
      router.replace('/sign-in');
    }
  }, [user, isLoading]);

  
  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!result.canceled) {
      await updateProfilePicture(result.assets[0]);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteUser(); 
              setUser(null); 
              setIsLoggedIn(false); 
              router.replace('/sign-in'); 
              Alert.alert('Success', 'Account deleted successfully');
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Failed to delete account. Please try again later.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const onLogoutPress = async () => {
    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false); 
      router.replace('/sign-in'); 
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <Text className="text-center text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }
  const navigateToForm = (fieldName, fieldValue, displayName) => {
    router.push({
      pathname: 'GenericFormProfile',
      params: {
        fieldName,
        fieldValue,
        userId: user.$id,
        displayName
      },
    });
  };

  const handleGoBack = () => {
    const routes = navigation.getState().routes; // Get the current navigation state
    const previousRoute = routes[routes.length - 2]; // Get the previous route

    if (previousRoute && previousRoute.name === '(auth)') {
      router.push('/');
    } else {
      router.back(); 
    }
  };

  return (
    <SafeAreaView className="bg-customWhite-200 h-full">
      <ScrollView>
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={handleGoBack} className="mr-24">
            <AntDesign name="arrowleft" size={24} color="black" />
            <Image source={icons.map} className="w-6 h-6" resizeMode="contain"/>
          </TouchableOpacity>
          <Text className="text-2xl font-sfbold">Profile</Text>
        </View>
        <View className="items-center mt-4">
          <TouchableOpacity className="relative" onPress={pickImage}>
            <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full" resizeMode="contain" />
            <View className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full">
              <AntDesign name="edit" size={14} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <View className="px-4 mt-6">
          <Text className="text-lg font-sfbold">Details</Text>
          
          <TouchableOpacity className="bg-gray-200 p-6 rounded-lg mt-4 flex-row justify-between items-center"
            onPress={() => navigateToForm('username', user.username || '', "Username")}
          >
          {!user.username && (
              <Text className="text-gray-700 font-sfregular text-lg">Username</Text>
          )}
            <Text className="text-gray-700 font-sfregular text-lg">{user.username}</Text>
            <AntDesign name="right" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-200 p-6 rounded-lg mt-4 flex-row justify-between items-center"
            onPress={() => navigateToForm('email', user.email || '', "Email")}
          >
            
          {!user.email && (
              <Text className="text-gray-700 font-sfregular text-lg">Email</Text>
          )}
          
          <Text className="text-gray-700 font-sfregular text-lg">{user.email}</Text>
            <AntDesign name="right" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View className="px-4 mt-6">
          <Text className="text-lg font-sfbold">Notifications</Text>
          <View className="bg-gray-200 p-4 rounded-lg mt-4 flex-row justify-between items-center">
            <Text className="text-gray-700">Car Chargers</Text>
            <Switch
              value={carChargingNotifications}
              onValueChange={setCarChargingNotifications}
            />
          </View>
          <View className="bg-gray-200 p-4 rounded-lg mt-4 flex-row justify-between items-center">
            <Text className="text-gray-700">Offers and Deals</Text>
            <Switch
              value={promotionsNotifications}
              onValueChange={setPromotionsNotifications}
            />
          </View>
          <CustomButton
              title="Become Partner"
              containerStyles={"w-full mt-3"}
              handlePress={() => { router.push('become-partner'); }}
              picture={icons.light}
            /> 
        <TouchableOpacity className="bg-gray-200 p-4 rounded-lg mt-4 flex-row justify-between items-center" onPress={onLogoutPress} >
          <Text className="text-red-500 font-sfbold text-lg">Logout</Text>
            <AntDesign name="right" size={20} color="red" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-200 p-4 rounded-lg mt-4 flex-row justify-between items-center"onPress={handleDeleteAccount} >
          <Text className="text-red-500 font-sfbold text-lg">Delete Account</Text>
            <AntDesign name="right" size={20} color="red" />
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

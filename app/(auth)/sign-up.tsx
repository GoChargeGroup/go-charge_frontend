import { View, Text, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { icons } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import { signup } from '@/lib/authService';
const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit= async ()=>{
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
    setIsSubmitting(true);
      try {
        // const result = await createUser(form.email, form.password, form.username);
        const user = await signup(form.username, form.password, form.email, form.role); 
        setIsLoggedIn(true);
        setUser(result);
        router.push('/');

      } catch (error) {
        Alert.alert('Error', error.message);
      } finally{
        setIsSubmitting(false);
      }
    
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="h-full bg-customWhite">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View className="w-full px-4 my-6 flex-1 items-center">
          
            <Text className="text-5xl text-center text-black font-sfregular mb-2">Power Up Your Journey. Join Us Today!</Text>
            <FormField
              placeholder="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7 w-11/12"
              formStyles="border-2 border-gray-600 rounded-xl"
              keyboardType="email-address"
            />
            <FormField
              placeholder="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="w-11/12"
              formStyles="border-2 border-gray-600 rounded-xl"
              keyboardType="email-address"
            />
            <FormField
              placeholder="Password"
              value={form.password}
              otherStyles={"w-11/12"}
               formStyles="border-2 border-gray-600 rounded-xl"
              handleChangeText={(e) => setForm({ ...form, password: e })}
              secureTextEntry
            />
            <CustomButton
              title="Create Account"
              handlePress={submit}
              containerStyles="mt-7 "
              isLoading={isSubmitting}
            />
            
            
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignUp
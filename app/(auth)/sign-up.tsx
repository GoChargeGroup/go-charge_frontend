import { View, Text, Image, KeyboardAvoidingView, Platform, Alert, Modal, TouchableOpacity } from 'react-native'
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const submit= async ()=>{
    setModalVisible(false);
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields');
      return; 
    }
    if(!verifyInput()) {
      return;
    }
    setIsSubmitting(true);
      try {
        // const result = await createUser(form.email, form.password, form.username);
        const user = await signup(form.username, form.password, form.email.toLowerCase(), form.role); 
        setIsLoggedIn(true);
        setUser(user);
        Alert.alert('Success!', "Your account has been successfully created");
        router.push('/profile');

      } catch (error) {
        Alert.alert('Error', error.message);
      } finally{
        setIsSubmitting(false);
      }
    
  }

  function verifyInput() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (form.username.includes(' ')) {
        Alert.alert("Error", "Username cannot contain spaces");
        return false;
      }
      if (!emailRegex.test(form.email)) {
        Alert.alert("Error", "Email is invalid");
        return false;
      } 
      else return true;
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
              otherStyles={"w-11/12 mb-4"}
               formStyles="border-2 border-gray-600 rounded-xl"
              handleChangeText={(e) => setForm({ ...form, password: e })}
              secureTextEntry
            />
            <View style={{flexDirection: "row", marginTop: 4}}>
              <Link href="sign-in"className="mr-4">
                    Back
              </Link>
              <CustomButton
                title="Create Account"
                handlePress={() => {setModalVisible(!isModalVisible);}}
                containerStyles="mt-7"
                isLoading={isSubmitting}
              />
            </View>
            
            
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              setModalVisible(!isModalVisible);
            }}
          >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
              }}>
              <View style={{
                width: 300,
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 10}}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                  Confirm Information
                </Text>
                <Text style={{marginBottom: 4}}>Email: {form.email}</Text>
                <Text style={{marginBottom: 4}}>Username: {form.username}</Text>
                <Text style={{marginBottom: 4}}>Password:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Text
                      style={{
                        flex: 1,
                        borderColor: 'gray',
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        backgroundColor: '#f0f0f0',
                      }}
                    >
                      {passwordVisible ? form.password : '••••••••'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      style={{ marginLeft: 10 }}
                    >
                      <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                  </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: 'space-between',}}>
                  <CustomButton title="Back" handlePress={() => setModalVisible(false)} />
                  <CustomButton title="Confirm" handlePress={submit} isLoading={isSubmitting} />
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignUp
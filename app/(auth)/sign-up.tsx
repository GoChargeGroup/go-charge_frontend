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

  const [securityQuestionsPage, setSecurityQuestionsPage] = useState(false);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  const submit= async ()=>{
    setModalVisible(false);
    if(!form.username || !form.email || !form.password || !answer1 || !answer2){
      Alert.alert('Error', 'Please fill in all the fields');
      return; 
    }

    if(!verifyInput()) {
      return;
    }
    setIsSubmitting(true);
      try {
        // const result = await createUser(form.email, form.password, form.username);
        const user = await signup(form.username, form.password, form.email.toLowerCase(), form.role, [answer1, answer2]); 
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
          { !securityQuestionsPage ? (
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
                <CustomButton
                  title="Back"
                  handlePress={() => router.push('/(auth)/sign-in')}
                  containerStyles="mt-6 mr-6 w-5/12"
                />
                <CustomButton
                  title="Create Account"
                  handlePress={() => {setModalVisible(!isModalVisible);}}
                  containerStyles="mt-6 w-5/12"
                  isLoading={isSubmitting}
                />
              </View>
            </View>
          ) : (
            <View className="w-full px-4 my-6 flex-1 items-center">
              <Text className="text-5xl text-center text-black font-sfregular mb-2">Almost there!</Text>
              <Text className="text-lg text-center text-black font-sfregular mb-4">Just answer a few security questions to finish signing up.</Text>
              <Text className="mt-4 mb-2">Security Question 1</Text>
              <Text className="text-xl">What street did you grow up on?</Text>
              <FormField
                placeholder="Enter your answer"
                value={answer1}
                onChangeText={setAnswer1}
                formStyles="border-2 border-gray-600 rounded-xl"
              />
        
              <Text className="mt-4 mb-2">Security Question 2</Text>
              <Text className="text-xl">What was the name of your first school?</Text>
              <FormField
                placeholder="Enter your answer"
                value={answer2}
                onChangeText={setAnswer2}
                formStyles="border-2 border-gray-600 rounded-xl"
              />
        
              <View style={{flexDirection: "row", marginTop: 20, marginHorizontal: 10}}>
                <CustomButton title="Back" containerStyles={'w-1/2'} handlePress={() => setSecurityQuestionsPage(false)} />
                <View style={{ width: 20 }} />
                <CustomButton title="Submit" containerStyles={'w-1/2'} handlePress={submit} />
              </View>
            </View>
          )}
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
                  <CustomButton title="Back" handlePress={() => setModalVisible(false)} containerStyles="w-1/2 mr-1"/>
                  <CustomButton title="Confirm" handlePress={() => { 
                    if(!form.username || !form.email || !form.password) {
                      Alert.alert('Error', 'Please fill in all the fields');
                    } else {setSecurityQuestionsPage(true); setModalVisible(false);}}}
                     isLoading={isSubmitting} 
                     containerStyles="w-1/2"/>
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
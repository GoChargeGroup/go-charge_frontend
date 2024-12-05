import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useGlobalContext } from '@/context/GlobalProvider';
import { editEmail, editUsername, login, sendEditUsernameVerification } from '@/lib/authService';

const GenericFormProfile = () => {
  const navigation = useNavigation();
  const { setUser, user } = useGlobalContext();
  const route = useRoute();
  const { fieldName, fieldValue, userId, displayName} = route.params;
  const [value, setValue] = useState(fieldValue);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [otp, setOTP] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  const showEditUsernameModal = async () => {
    try {
      await sendEditUsernameVerification();
    } catch (error) {
        Alert.alert('Error', error.message);
    }
    setUsernameModalVisible(true);
  };

  const handleUpdateUsername = async () => {
    try {
      verifyInput();
      await editUsername(otp, value); 
      Alert.alert('Success', 'Username updated successfully!');
      setUsernameModalVisible(false);
      router.back();
    } catch (error) {
      console.log(error);
      setUsernameModalVisible(false);
      Alert.alert('Error', 'Failed to update username. Please try again later.');
      router.back();
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!verifyInput()) return;
      await editEmail(value, [answer1, answer2]); 
      Alert.alert('Success', 'Email updated successfully!');
      setEmailModalVisible(false);
      router.back();
    } catch (error) {
      console.log(error);
      setEmailModalVisible(false);
      Alert.alert('Error', 'Failed to update email. Please try again later.');
      router.back();
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

  useEffect(() => {
    let timer;
    if (usernameModalVisible) {
      setTimeLeft(300); 

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setUsernameModalVisible(false); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer); 
  }, [usernameModalVisible]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

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
              handlePress={() => {if (fieldName == "username") showEditUsernameModal(); else setEmailModalVisible(true);}}
              containerStyles="mt-7 w-full"
              textStyles=""
            />
          </View>
          <Modal
            visible={usernameModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setUsernameModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 300,
                  padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                  Edit Username
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
                  Please check your email for a verification code.
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 20, color: 'red' }}>
                  Code will expire in: {formatTime(timeLeft)}
                </Text>
                <OtpInput
                  numberOfDigits={5}
                  onTextChange={(otp) => {setOTP(otp)}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginRight: 10,
                      marginTop: 10,
                      backgroundColor: '#ccc',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => setUsernameModalVisible(false)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginTop: 10,
                      backgroundColor: 'red',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={handleUpdateUsername}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={emailModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setEmailModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 300,
                  padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                  Edit Email
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                  Please answer these security questions to finish editing your email.
                </Text>
                <Text className="mb-2">Security Question 1</Text>
                <Text className="text-xl">What street did you grow up on?</Text>
                <FormField
                  placeholder="Enter your answer"
                  value={answer1}
                  onChangeText={setAnswer1}
                  formStyles="border-2 border-gray-600 rounded-xl mb-2"
                  textStyles="!pt-0"
                  otherStyles="!space-y-0"
                />
          
                <Text className="mt-4 mb-2">Security Question 2</Text>
                <Text className="text-xl">What was the name of your first school?</Text>
                <FormField
                  placeholder="Enter your answer"
                  value={answer2}
                  onChangeText={setAnswer2}
                  formStyles="border-2 border-gray-600 rounded-xl"
                  textStyles="!pt-0"
                  otherStyles="!space-y-0"
                />
               
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginRight: 10,
                      marginTop: 15,
                      backgroundColor: '#ccc',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => setEmailModalVisible(false)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginTop: 15,
                      backgroundColor: 'red',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={handleUpdateEmail}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default GenericFormProfile;

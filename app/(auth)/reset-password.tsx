import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FormField from '@/components/FormField';
import { resetPassword, sendEmailVerification } from '@/lib/authService';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Route } from 'expo-router/build/Route';
import CustomButton from '@/components/CustomButton';

const ResetPassword = () => {
  const { setIsLoggedIn, setUser } = useGlobalContext();
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const sendResetEmail = async () => {
    try {
        setIsEmailSent(await sendEmailVerification(email.toLowerCase()));
    } catch (error) {
        Alert.alert('Error', error.message);
    }
  };

  const submitPasswordReset = async () => {
    if (newPassword === confirmPassword) {
      try {
        const user = await resetPassword(otp, newPassword);
        setIsEmailSent(false);
        setUser(user);
        setIsLoggedIn(true);
        router.push('/');
      } catch (error) {
        Alert.alert('Error', error.message);
        setIsEmailSent(false);
      }
  
    } else {
        Alert.alert('Error', 'Passwords do not match.');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="h-full bg-customWhite">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View className="w-full px-4 my-6 flex-1 items-center">
                {!isEmailSent && (
                    <>
                    <Text className="text-5xl text-center text-black font-sfregular mb-2">Reset Password</Text>
                    <FormField
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        otherStyles="mt-7 w-11/12 mb-2"
                        formStyles="border-2 border-gray-600 rounded-xl"
                        keyboardType="email-address"
                    />
                    <CustomButton title="Submit" handlePress={sendResetEmail} />
                    <Link href="sign-in" className="text-center text-lg text-blue-500 mt-1 underline">
                        Back to login
                    </Link>
                    </>
                )}

                {isEmailSent && (
                    <>
                    <Text className="text-4xl text-center text-black font-sfregular mb-2 pt-10">Please enter your new password.</Text>
                    <FormField
                        placeholder="Confirmation Code"
                        value={otp}
                        onChangeText={setOtp}
                        otherStyles="w-11/12"
                        formStyles="border-2 border-gray-600 rounded-xl"
                        keyboardType="numeric"
                    />
                    <FormField
                        title="Password"
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        otherStyles="w-11/12"
                        formStyles="border-2 border-gray-600 rounded-xl"
                    />
                    <FormField
                        title="Password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        otherStyles="w-11/12 mb-2"
                        formStyles="border-2 border-gray-600 rounded-xl"
                    />
                    <CustomButton title="Reset Password" handlePress={submitPasswordReset} containerStyles={undefined} textStyles={undefined} isLoading={undefined} picture={undefined} />
                    <View style={{flexDirection: "row"}}>
                        <CustomButton title="Back" handlePress={() => setIsEmailSent(false)} />
                        <CustomButton title="Resend Email" handlePress={sendResetEmail} />
                    </View>
                    </>
                )}
            </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ResetPassword;

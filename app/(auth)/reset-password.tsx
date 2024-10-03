import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FormField from '@/components/FormField';
import { resetPassword, sendEmailVerification } from '@/lib/authService';
import { Route } from 'expo-router/build/Route';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const sendResetEmail = async () => {
    try {
        setIsEmailSent(await sendEmailVerification(email));
    } catch (error) {
        Alert.alert('Error', error.message);
    }
  };

  const submitPasswordReset = async () => {
    if (newPassword === confirmPassword) {
      try {
        await resetPassword(otp, newPassword);
        router.push('/sign-in');
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
                    <Button title="Submit" onPress={sendResetEmail} />
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
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        otherStyles="w-11/12"
                        formStyles="border-2 border-gray-600 rounded-xl"
                        secureTextEntry
                    />
                    <FormField
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        otherStyles="w-11/12 mb-2"
                        formStyles="border-2 border-gray-600 rounded-xl"
                        secureTextEntry
                    />
                    <Button title="Reset Password" onPress={submitPasswordReset} />
                    <View style={{flexDirection: "row"}}>
                        <Button title="Back" onPress={() => setIsEmailSent(false)} />
                        <Button title="Resend Email" onPress={sendResetEmail} />
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

import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FormField from '@/components/FormField';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const sendResetEmail = async () => {
    setIsEmailConfirmed(await sendEmailVerification);
    setIsEmailSent(true);
  };

  const resendEmail = () => {
    // Logic to resend the reset email
    setIsEmailSent(true);
  };

  const confirmEmail = () => {
    // Logic to confirm the email
    setIsEmailConfirmed(true);
  };

  const resetPassword = () => {
    // Logic to reset password
    if (newPassword === confirmPassword) {
      // Proceed with password reset
      console.log('Passwords match. Resetting password...');
    } else {
      console.log('Passwords do not match.');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="h-full bg-customWhite">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View className="w-full px-4 my-6 flex-1 items-center">
                {!isEmailSent && !isEmailConfirmed && (
                    <>
                    <Text className="text-5xl text-center text-black font-sfregular mb-2">Reset Password</Text>
                    <FormField
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        otherStyles="mt-7 w-11/12"
                        formStyles="border-2 border-gray-600 rounded-xl"
                        keyboardType="email-address"
                    />
                    <Button title="Submit" onPress={sendResetEmail} />
                    <Link href="sign-in" className="text-center text-lg text-blue-500 mt-1 underline">
                        Back to login
                    </Link>
                    </>
                )}

                {isEmailSent && !isEmailConfirmed && (
                    <>
                    <Text className="text-4xl text-center text-black font-sfregular mb-2 pt-10">Please check your email for the next steps</Text>
                    <Button title="Resend Email" onPress={resendEmail} />
                    <Button title="Back" onPress={() => setIsEmailSent(false)} />
                    </>
                )}

                {isEmailConfirmed && (
                    <>
                    <FormField
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        className="mt-7 w-11/12 border-2 border-gray-600 rounded-xl"
                        secureTextEntry
                    />
                    <FormField
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        className="mt-7 w-11/12 border-2 border-gray-600 rounded-xl"
                        secureTextEntry
                    />
                    <Button title="Reset Password" onPress={resetPassword} />
                    <Link href="sign-in" className="text-center text-lg text-blue-500 mt-1 underline">
                        Back to login
                    </Link>
                    </>
                )}
            </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ResetPassword;

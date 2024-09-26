import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as WebBrowser from "expo-web-browser"
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
// import { getCurrentUser, googleLogin, signIn } from '@/lib/appwrite';
// import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
// import * as Google from "expo-auth-session/providers/google";
const iosClientId= '88005189019-04ji2uki3gs649ceipi5vvm2qff0o0id.apps.googleusercontent.com';
const webClientId = '88005189019-fkpobd51f2vguhvfnmf87uqoe4uafbjn.apps.googleusercontent.com';
const SignIn = () => {
  WebBrowser.maybeCompleteAuthSession();
  const config = {
      webClientId,
      iosClientId
  }

//   const [request, response, promptAsync] = Google.useAuthRequest(config);

  const getUserProfile = async (token: any)=>{
    // if(!token) return;
    // try {
    //   const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    //     headers: {Authorization: `Bearer ${token}`}
    //   });
    //   const user = await response.json();
    //   return user;
    // } catch (error) {
    //   console.log(error)
    // }
  }
  const handleToken = () => {
    // if(response?.type === "success"){
    //   const {authentication} = response;
    //   const token  = authentication?.accessToken;
    //   console.log("access token", token)
    //   getUserProfile(token);
    // }
  }
  useEffect(()=>{
//     handleToken();
  }, [Response])
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
//   const { setIsLoggedIn, setUser } = useGlobalContext();
  const submit= async ()=>{
    // if(!form.email || !form.password){
    //   Alert.alert('Error', 'Please fill in all the fields');
    //   return;
    // }
    // setIsSubmitting(true);
    //   try {
    // //    await signIn(form.email, form.password);
    // //    const user = await getCurrentUser();
    //    setIsLoggedIn(true);
    //    setUser(user);
    //    router.push('/');
    //   } catch (error) {
    //     Alert.alert('Error', error.message);
    //   } finally{
    //     setIsSubmitting(false);
    //   }
    
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="h-full bg-customWhite">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View className="w-full px-4 my-6 flex-1 items-center">
            {/* <Image source={icons.logo} className="self-center w-11/12 h-16 mt-10" resizeMode="contain" /> */}
            <Text className="text-xl text-center text-black font-sfregular mb-2">Power Up Your Journey. Join Us Today!</Text>
            <FormField
              placeholder="Phone number or email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7 w-11/12"
              formStyles="border-2 border-gray-600 rounded-xl"
              keyboardType="email-address"
            />
            <FormField
              placeholder="     Enter password"
              value={form.password}
              otherStyles={"w-11/12"}
               formStyles="border-2 border-gray-600 rounded-xl"
              handleChangeText={(e) => setForm({ ...form, password: e })}
              secureTextEntry
            />
            <CustomButton
              title="Login"
              handlePress={submit}
              containerStyles="mt-7 "
              isLoading={isSubmitting}
            />
            <View className="justify-between flex-row">
            <Link href="/forgot-password" className="text-center text-lg text-gray-600 mt-1">
              Forgot password?
            </Link>
            <Link href="sign-up"className="text-center text-lg text-blue-500 mt-1 underline">
                /New User?
            </Link>
            </View>
            
          </View>
          <CustomButton
          title="Log in with Google"
        //   handlePress={promptAsync}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignIn
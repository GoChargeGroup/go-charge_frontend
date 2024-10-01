import { useFonts } from 'expo-font';
import { SplashScreen, Stack, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { View, Image, Text } from 'react-native'
import {GlobalProvider} from '../context/GlobalProvider'

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "SFPRODISPLAYREGULAR": require("../assets/fonts/SFPRODISPLAYREGULAR.otf"),
    "SFPRODISPLAYBOLD": require("../assets/fonts/SFPRODISPLAYBOLD.otf"),
  });
  useEffect(()=>{
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync(); 
   }, [fontsLoaded, error])
 
   if(!fontsLoaded && !error) return null;
  return (
    <GlobalProvider>

    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="(auth)" options={{headerShown: false}} />
      <Stack.Screen name="(charger)" options={{headerShown: false}} />
      <Stack.Screen name="profile" options={{headerShown: false}} />

    </Stack>
    </GlobalProvider>
    
  );
}

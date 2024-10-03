import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { icons } from '@/constants';
import moment from 'moment';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useRouter, useLocalSearchParams  } from 'expo-router';

const ChargerSession = () => {
  const { charger } = useLocalSearchParams();
  const [timeStarted, setTimeStarted] = useState(new Date());
  const [timePassed, setTimePassed] = useState(0);
  const [kWhCharged, setKWhCharged] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const { user } = useGlobalContext();
  const router = useRouter();
  const kWhRatePerMinute = 0.05; 
  const pricePerkWh = charger?.price || 50; 
  const calculateChargingSession = () => {
    const currentTime = new Date();
    const durationInMinutes = Math.floor((currentTime - timeStarted) / (1000 * 60)); 
    setTimePassed(durationInMinutes);
    const charged = durationInMinutes * kWhRatePerMinute;
    setKWhCharged(charged);
    setTotalCost(charged * pricePerkWh);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      calculateChargingSession();
    }, 60000); 

    return () => clearInterval(timer); 
  }, [timeStarted]);

  const handleEndCharging = () => {
    const updatedCharger = { ...charger, isWorking: true };

    router.back(); 
  };

  return (
    <View className="w-full justify-center min-h-[80vh] px-4 my-6">
    
      <View>
        <Text className="text-2xl font-sfbold mb-6">Charging Session</Text>

       
        <Text className="text-xl mb-4 font-sfregular">
          Time Started: {moment(timeStarted).format('HH:mm:ss')}
        </Text>

      
        <Text className="text-xl mb-4 font-sfregular">
          Time Passed: {timePassed} minutes
        </Text>

       
        <Text className="text-xl mb-4 font-sfregular">
          kWh Charged: {kWhCharged.toFixed(2)} kWh
        </Text>

       
        <Text className="text-xl mb-4 font-sfregular">
          Total Cost: {totalCost.toFixed(2)} USD
        </Text>
      </View>

    
      <TouchableOpacity
        onPress={handleEndCharging}
        className="items-center justify-center "
      >
        <Image source={icons.charger} className="w-40 h-40" resizeMode="contain" />
        <Text className="text-2xl font-sfbold mt-4">End Charging</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChargerSession;

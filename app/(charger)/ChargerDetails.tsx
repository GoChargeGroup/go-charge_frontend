import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';

const ChargerDetails = () => {
  const { charger } = useLocalSearchParams();
  const chargerData = JSON.parse(charger); 

  const { session, setSession } = useGlobalContext();

  return (
    <ScrollView className="flex-1 px-4 py-4">
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="text-2xl font-bold mb-2">{chargerData.name}</Text>
        <Text className="text-base mb-2">{chargerData.description}</Text>
        <Text className="text-base">
          <Text style={{ fontWeight: 'bold' }}>KWh Type ID: </Text>
          {chargerData.kWh_types_id}
        </Text>
        <Text className="text-base">
          <Text style={{ fontWeight: 'bold' }}>Charger Type ID: </Text>
          {chargerData.charger_types_id}
        </Text>
        <Text className="text-base">
          <Text style={{ fontWeight: 'bold' }}>Status: </Text>
          {chargerData.status}
        </Text>
        <Text className="text-base">
          <Text style={{ fontWeight: 'bold' }}>Price: </Text>${chargerData.price}
        </Text>
        <Text className="text-base">
          <Text style={{ fontWeight: 'bold' }}>Total Payments: </Text>${chargerData.total_payments}
        </Text>
      </View>

      <TouchableOpacity
       //onPress={handleStartCharging}
        style={{
          backgroundColor: '#007bff',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 16,
        }}
      >
        <Image source={icons.light} style={{ width: 24, height: 24, marginRight: 8 }} />
        
        <Text
          style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
          onPress={() => {
            if (session) {
              setSession(null)
            } else {
              setSession(chargerData)
            }
          }}
        >
          {session && session._id == chargerData._id ? 'Start Charging Session' : 'End Charging Session'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChargerDetails;

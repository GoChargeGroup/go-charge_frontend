import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ChargerDetails = () => {
  const { charger } = useLocalSearchParams();
  const chargerData = JSON.parse(charger); 

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
    </ScrollView>
  );
};

export default ChargerDetails;

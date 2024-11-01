import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { icons } from '@/constants';
import { haversineDistance } from '@/utils/utils';

const QuickSuggest = ({ stations, userLocation, onClose }) => {
  if (!stations) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 20,
      left: 10,
      right: 10,
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    }}>
      <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
        <Image source={icons.x} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
        GoCharger Quick-Suggest
      </Text>

       {/* Station Details */}
       {stations.map((station, index) => {
        const distance = haversineDistance(
          { latitude: userLocation[1], longitude: userLocation[0] },  // User's location
          { latitude: station.latitude, longitude: station.longitude }  // Charger location
        ).toFixed(2);

        return (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{station.name}</Text>
            <Text style={{ fontSize: 14, color: '#555' }}>{station.description}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
              <Image source={icons.map} style={{ width: 16, height: 16, marginRight: 4 }} />
              <Text style={{ color: '#888' }}>{station.address}</Text>
            </View>
            
            <Text style={{ fontSize: 16 }}>Distance: {distance} km</Text>
          </View>
        );
      })}

      {/* Directions Button */}
      <TouchableOpacity
        onPress={() => Alert.alert("Feature Coming Soon", "Directions feature is under development")}
        style={{
          marginTop: 12,
          padding: 10,
          backgroundColor: '#007bff',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickSuggest;

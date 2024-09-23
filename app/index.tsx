import { View, Text, ActivityIndicator, Platform, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';

const Index = () => {
  const [location, setLocation] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true); 

  const mapRef = useRef(null);

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const fetchChargers = async () => {
 
    const chargersData = [
      { id: 1, name: 'Charger 1', latitude: 40.52217359148111, longitude: -86.93082888528933 },
      { id: 2, name: 'Charger 2', latitude: 40.22217359148111, longitude: -86.93082888528933 },
    
    ];
    setChargers(chargersData);
    setLoading(false); 
  };

  useEffect(() => {
    fetchLocation();
    fetchChargers();
  }, []);

  const initialRegion = {
    latitude: 40.42217359146111,
    longitude: -86.93082888528933,
    latitudeDelta: 2,
    longitudeDelta: 2.1,
  };

  const centerMapOnUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    }
  };

  const showMarkers = () => {
    return chargers.map((item) => (
      <Marker
        key={item.id}
        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
        title={item.name}
      >
        <View>
          <Image
            source={{ uri: 'https://img.icons8.com/color/48/000000/electricity.png' }} 
            style={{ width: 30, height: 30 }}
          />
        </View>
      </Marker>
    ));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {showMarkers()}
      </MapView>
    </View>
  );
};

export default Index;

import { View, Text, ActivityIndicator, Platform, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { icons } from '../constants';
import CustomButton from '@/components/CustomButton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Index = () => {
  const [location, setLocation] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [isMarkerPressed, setIsMarkerPressed] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); 
  const [chargerDetailsVisible, setChargerDetailsVisible] = useState(false);
  const mapRef = useRef(null);
  const menuSnapPoints = useMemo(() => ['66%'], []);
  const openMenuSheet = () => {
    setMenuVisible(true);
    menuSheetRef.current?.expand();
  };
  const closeMenuSheet = () => {
    setMenuVisible(false); // Set menu visibility to false
    menuSheetRef.current?.close();
  };
  const menuSheetRef = useRef(null);
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

  const onMarkerSelected = (charger) => {
    setIsMarkerPressed(true);
    setSelectedCharger(charger);
  };
  const handleMapPress = () => {
    if (!isMarkerPressed) {
      setSelectedCharger(null);
      setChargerDetailsVisible(false)
    } else {
      setIsMarkerPressed(false);
    }
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
    return chargers.map((item, index) => (
      <Marker
        key={index}
        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
        onPress={() => onMarkerSelected(item)}
      >
          <View className={selectedCharger?.id === item.id ? "bg-customWhite-200 rounded-full text-center align-middle w-8 h-8 leading-10" : ""}>
          <Image
            source={icons.charger}
            className="w-10 h-10 right-1"
            resizeMode="contain"
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
    <GestureHandlerRootView style={{ flex: 1 }}>

    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={handleMapPress}
      >
        {showMarkers()}
      </MapView>

      <BottomSheet
            ref={menuSheetRef}
            snapPoints={menuSnapPoints}
            enablePanDownToClose={true}
            onClose={closeMenuSheet}
            index={-1}
          >
        <BottomSheetView  style={{ flex: 1, alignItems: 'center', justifyContent: 'top', backgroundColor: "#F6F6F7A6", opacity: "65%" }}>
              
              <View className="w-full flex-row justify-between items-center px-4 mb-4">
                <Text className="flex-1 text-center font-sfbold text-2xl">Menu</Text>
                <TouchableOpacity onPress={closeMenuSheet}>
                  <Image source={icons.x} className="w-6 h-6" resizeMode="contain"/>
                </TouchableOpacity>
                </View>
              <TouchableOpacity className="" onPress={() => {
                // if (isLoggedIn) {
                //   // Redirect to profile page if logged in
                //   router.push('/profile');
                // } else {
                //   // Redirect to sign-in page if not logged in
                //   router.push('/sign-in');
                // }
              }}>
                   <View className="w-11/12 p-4 mb-4 bg-customWhite-200 rounded-2xl   flex-row justify-between items-center ">
                    <View>
                      <Text className="text-xl font-sfbold">My Profile</Text>
                      {/* {user && user.username && (
                      <Text className="text-sm text-gray-600 mt-1">{user.username}</Text>
                      )} */}
                    </View>
                    <Image source={icons.profile} className="w-10 h-10" />
                  </View>
              </TouchableOpacity>
              <CustomButton
              title="Became a partner"
              handlePress={() => { router.push('become-partner'); }}
              picture={icons.light}
            /> 
              <View className="w-11/12 flex-row justify-between">
              <TouchableOpacity className="w-full p-6 mr-2 bg-customWhite-200 rounded-2xl  flex-col justify-center items-center" onPress={() => { router.push('/support')/* handle navigation */ }}>
                <Text className="text-lg font-sfbold">Support</Text>
                <Text className="text-md text-gray-600 font-sfregular">Help in anytime</Text>
              </TouchableOpacity>
              
              </View>
              
              {/* {isLoggedIn && user?.role === 3 && (
                <TouchableOpacity className="w-11/12 p-4 mb-3 bg-green-100 rounded-2xl flex-row justify-center items-center mt-20" onPress={() => router.push('/createCharger')}>
                  <Text className="text-lg text-white">Добавить зарядку</Text>
                </TouchableOpacity>
              )} */}
            </BottomSheetView>
           
          </BottomSheet>
      {!menuVisible && !chargerDetailsVisible &&(
          <TouchableOpacity onPress={openMenuSheet} className="absolute bottom-12 ">
            <Image source={icons.menu} className="w-20 h-20" resizeMode="contain" />
        </TouchableOpacity>
          )}
          {!menuVisible && !chargerDetailsVisible &&(
          <TouchableOpacity onPress={centerMapOnUserLocation} className="absolute bottom-12 right-1 ">
            <Image source={icons.plus} className="w-20 h-20" resizeMode="contain" />
          </TouchableOpacity>
          )}
    </View>
    </GestureHandlerRootView>

  );
};

export default Index;

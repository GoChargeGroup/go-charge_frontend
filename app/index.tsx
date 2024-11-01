import { View, Text, ActivityIndicator, Platform, Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { icons } from '../constants';
import CustomButton from '@/components/CustomButton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from 'expo-router';
import ChargerItem from '@/components/ChargerItem';
import MapSearchBar from '@/components/MapSearchBar';
import axios from 'axios';
import ChargerDetailsSheet from '@/components/ChargerDetailsSheet';
import { getChargingStations } from '@/lib/authService';
import QuickSuggest from '@/components/QuickSuggest';
import { haversineDistance } from '@/utils/utils';

const Index = () => {
  const [location, setLocation] = useState(null);
  const mapAnimRef = useRef();
  const {isLoggedIn, user} = useGlobalContext();
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closestChargers, setClosestChargers] = useState({
    was_shown: false,
    list: null
  });
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [isMarkerPressed, setIsMarkerPressed] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); 
  const [searchBarVisible, setSearchBarVisible] = useState(false); 
  const [savedFilter, setSavedFilter] = useState<{
    maxPrice: number;
    maxDistance: number;
    selectedPlugTypes: { label: string; value: string; }[];
    powerLevels: { label: string; value: string; checked: boolean }[];
    status: { label: string; value: string; checked: boolean }[];
  } | null>(null);
  const [chargerDetailsVisible, setChargerDetailsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
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

  //#region Search Bar Functionality
  const MAPBOX_API_KEY = process.env.EXPO_PUBLIC_REACT_APP_MAPBOX_API_KEY;
  const searchSnapPoints = useMemo(() => ['85%'], []);
  const openSearchSheet = () => {
    setSearchBarVisible(true);
    searchSheetRef.current?.expand();
  };
  const closeSearchSheet = () => {
    Keyboard.dismiss();
    setSearchBarVisible(false); 
    searchSheetRef.current?.close();
  };
  const searchSheetRef = useRef(null);

  // Get location from search
  const fetchSearchLocation = async (place: string) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json`,
        {
          params: {
            access_token: MAPBOX_API_KEY,
          },
        }
      );

      // Use first result
      if (response.data.features && response.data.features.length > 0) {
        const locationData = response.data.features[0];
        const [longitude, latitude] = locationData.center;

        // create new location object 
        const newLocation: Location.LocationObject = {
          coords: {
            latitude,
            longitude,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now(),
        };

        setLocation(locationData.center)
      } else {
        // If no results are found, show an alert
        Alert.alert('No results found.');
      }
    } catch (error: unknown) {
      // Check if the error is an instance of the built-in Error class
      if (error instanceof Error) {
        Alert.alert('Error fetching location', error.message);
      } else {
        Alert.alert('Error fetching location', 'An unknown error occurred.');
      }
    } finally {
      //Close search sheet
      Keyboard.dismiss();
      setSearchBarVisible(false); // Set menu visibility to false
      searchSheetRef.current?.close();
    }
  };

  // Handler for search function
  const handleSearch = (place: string) => {
    fetchSearchLocation(place);
  }; 
  
  //#endregion Search Bar Functionality

  //#region Filter Functionality
  const applyFilterOptions = async (filter: {
    maxPrice: number;
    maxDistance: number;
    selectedPlugTypes: { label: string; value: string; }[];
    powerLevels: { label: string; value: string; checked: boolean }[];
    status: { label: string; value: string; checked: boolean }[];
  }) => {
    // Save the filter options for later use
    setSavedFilter(filter);
    try {
      const stations = await getChargingStations({
        status: filter.status.filter(s => s.checked).map(s => s.value), 
        power_output: filter.powerLevels.filter(pl => pl.checked).map(pl => pl.value), 
        plug_type: filter.selectedPlugTypes,
        max_price: filter.maxPrice,
        max_radius: filter.maxDistance * 1609.34,
        max_results: 20,
        coordinates: location,
      });

      if (stations && stations.length > 0) {
        setChargers(stations.map((x: object) => ({
          ...x,
          id: x._id,
          pictures: x.picture_urls,
          latitude: x.coordinates[1],
          longitude: x.coordinates[0],
          isWorking: x.status,
          working_hours: "24/7",
          price: x.price,
          contact: "Daddy Mitch",
          amount: 1,
        })));
        
      } else {
        alert("No charging stations found");
        setChargers([]);
      }
    } catch (err) {
      console.error("Error fetching nearby charging stations:", err);
      Alert.alert("Error", "Error fetching nearby charging stations");
    }
  };

  //Get filter params for getChargerStations call
  const getChargingStationParams = (filter, location) => {
    return {
      status: filter.status.filter(s => s.checked).map(s => s.value), 
      power_output: filter.powerLevels.filter(pl => pl.checked).map(pl => pl.value), 
      plug_type: filter.selectedPlugTypes,
      max_price: filter.maxPrice,
      max_radius: filter.maxDistance * 1609.34,
      max_results: 20,
      coordinates: location,
    };
  };

  //#endregion Filter Functionality
  
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const coords = [location.coords.longitude, location.coords.latitude]
    setLocation(coords);
  };

 

  const fetchChargers = async () => {
    if (!location) {
      console.log("Location not available, skipping fetchChargers");
      return;
    }
    setLoading(true); 

    try {
      const stations = await getChargingStations(savedFilter? 
        getChargingStationParams(savedFilter, location) : {
            coordinates: location,
            max_radius: 200000,
            max_results: 20,
          });

      
      if (stations && stations.length > 0) {
        const new_stations = stations.map((x: object) => ({
          ...x,
          id: x._id,
          pictures: x.picture_urls,
          latitude: x.coordinates[1],
          longitude: x.coordinates[0],
          isWorking: x.status,
          working_hours: "24/7",
          price: x.price,
          contact: "Daddy Mitch",
          amount: 1,
        }))
        setChargers(new_stations);

        if (!closestChargers.was_shown) {
          setClosestChargers({
            was_shown: true,
            list: new_stations.slice(0, 3)
          });
        }
      } else {
        alert("No charging stations found");
        setChargers([]);
      }
    } catch (err) {
      console.error("Error fetching nearby charging stations:", err);
      console.log(err.message)
      Alert.alert("Error", "Error fetching nearby charging stations");
    }

    setLoading(false); 
  };

  useEffect(() => {
    if (location) {
      centerMapOnLocation();
      fetchChargers(); 
    }
  }, [location]);
  
  useEffect(() => {
    fetchLocation(); 
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
  const centerMapOnLocation = () => {
    if (location && mapRef.current) {
      if (mapAnimRef.current) {
        clearTimeout(mapAnimRef.current);
        mapAnimRef.current = null;
      }
      mapAnimRef.current = setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude: location[1],
          longitude: location[0],
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });
      }, 1000);
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
      <View className="absolute w-full top-32 pl-3 pr-3 right-1 left-1">
        {closestChargers.list && (
          <QuickSuggest
            stations={closestChargers.list}
            onClose={() => setClosestChargers({
              ...closestChargers,
              list: null
            })}
          />
        )}
      </View>
      
      <View className="absolute bottom-32 pl-3 pr-3 right-1 left-1">
      {selectedCharger && selectedCharger.latitude && selectedCharger.longitude && !chargerDetailsVisible && (
        <ChargerItem
          charger={selectedCharger}
          userLocation={location}
          onPress={() => setChargerDetailsVisible(true)}
        />
      )}
        </View>

        {chargerDetailsVisible && selectedCharger && (
            
            <View className="absolute bottom-0 left-0 right-0 h-[85%] mt-10 rounded-xl">
              <View> 
              <ChargerItem
                  charger={selectedCharger}
                  userLocation={location}
                  otherStyles={""}
                />
              </View>
              
              <ChargerDetailsSheet charger={selectedCharger} setSelectedCharger={setSelectedCharger} />
            
            </View>
          )}  

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
                if (isLoggedIn) {
                  // Redirect to profile page if logged in
                  router.push('/profile');
                } else {
                  // Redirect to sign-in page if not logged in
                  router.push('/sign-in');
                }
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
              title="Become a partner"
              handlePress={() => { router.push('become-partner'); }}
              picture={icons.light}
            /> 
              <View className="w-11/12 flex-row justify-between">
                <TouchableOpacity 
                  className="w-1/2 p-6 mr-2 bg-customWhite-200 rounded-2xl flex-col justify-center items-center" 
                  onPress={() => { router.push('/support'); }}
                >
                  <Text className="text-lg font-sfbold">Support</Text>
                  <Text className="text-md text-gray-600 font-sfregular">Help in anytime</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="w-1/2 p-6 bg-customWhite-200 rounded-2xl flex-col justify-center items-center" 
                  onPress={() => {
                    if (!isLoggedIn) {
                    
                      router.push('/sign-in');
                    } else {
                    
                      const favoriteChargers = chargers.filter(charger => 
                        user?.favorite_station_ids.includes(charger.id)
                      );
                      router.push({
                        pathname: '/favorite-stations',
                        params: { favoriteChargers: JSON.stringify(favoriteChargers) }
                      });
                    }
                  }}
                >
                  <Text className="text-lg font-sfbold">Favorite Stations</Text>
                </TouchableOpacity>


              </View>

              
              {/* {isLoggedIn && user?.role === 3 && (
                <TouchableOpacity className="w-11/12 p-4 mb-3 bg-green-100 rounded-2xl flex-row justify-center items-center mt-20" onPress={() => router.push('/createCharger')}>
                  <Text className="text-lg text-white">Добавить зарядку</Text>
                </TouchableOpacity>
              )} */}
            </BottomSheetView>
           
          </BottomSheet>
      
      {/* Search Sheet */}
      <BottomSheet 
          ref={searchSheetRef}
          snapPoints={searchSnapPoints}
          enablePanDownToClose={true}
          onClose={closeSearchSheet}
          index={-1}> 
        <BottomSheetView style={{ flex: 1, alignItems: 'center', justifyContent: 'top', backgroundColor: "#F6F6F7A6", opacity: "65%" }}>
          <MapSearchBar onSearch={handleSearch} applyOptions={applyFilterOptions}></MapSearchBar>
          {showMarkers()}
        </BottomSheetView>
      </BottomSheet>

      {/* Search Button */}
      {!searchBarVisible && !menuVisible && !chargerDetailsVisible && !selectedCharger &&(
        <TouchableOpacity onPress={openSearchSheet} className="absolute bottom-32 right-5">
          <View style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={openSearchSheet} style={{ width: 25, height: 25 }}>
              <Image 
                  source={icons.searchButton} 
                  style={{ width: '100%', height: '100%' }} 
                  resizeMode="contain" 
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
      {/* Menu */}
      {!searchBarVisible && !menuVisible && !chargerDetailsVisible &&(
        <TouchableOpacity onPress={openMenuSheet} className="absolute bottom-12 ">
          <Image source={icons.menu} className="w-20 h-20" resizeMode="contain" />
        </TouchableOpacity>
          )}
      {/* Center Map */}
      {!searchBarVisible && !menuVisible && !chargerDetailsVisible &&(
        <TouchableOpacity onPress={centerMapOnLocation} className="absolute bottom-12 right-1 ">
          <Image source={icons.plus} className="w-20 h-20" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
    </GestureHandlerRootView>
  );
};

export default Index;

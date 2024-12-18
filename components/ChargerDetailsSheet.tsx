import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ChargerItem from "@/components/ChargerItem";
import * as Location from 'expo-location';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import CustomButton from './CustomButton';
import ReviewForm from '@/app/(charger)/reviewForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { router, useNavigation, useRouter } from 'expo-router';
import { favoriteStation, getStationReviews, unfavoriteStation } from '@/lib/authService';
const PhotosTab = ({ charger, setSelectedCharger }) => {
    if (!charger) {
      return <Text>Loading...</Text>;
    }
   
    
    return (
      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          {charger.pictures && charger.pictures.length > 0 ? (
            <View>
              {charger.pictures.map((picture, index) => (
                <Image key={index} source={{ uri: picture }} className="w-full h-56 mb-4 rounded-lg" resizeMode="cover" />
              ))}
            </View>
          ) : (
            <Text>No photos available</Text>
          )}
           
        </View>
      </ScrollView>
    );
  };
  

  const ReviewsTab = ({ charger }) => {
    const [reviews, setReviews] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const { isLoggedIn, user } = useGlobalContext();
    const flatListRef = useRef(null);
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          // Replace with actual logic to fetch reviews for the charger
          const reviewsData = []; // Dummy reviews data
          setReviews(reviewsData);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
  
      fetchReviews();
    }, [charger]);
  
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push(
          <Image
            key={i}
            source={i < rating ? icons.star : icons.starFilled}
            className="w-4 h-4 ml-1"
          />
        );
      }
      return stars;
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={reviews}
          ref={flatListRef}
          renderItem={({ item }) => (
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-lg font-bold">{user?.username || 'Anonymous'}</Text>
              <View className="flex-row items-center mb-2">
                {renderStars(item.rating)}
                <Text className="text-sm text-gray-500 ml-2">{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text className="text-base mb-2">{item.commentary}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={250}>
          <ReviewForm charger={charger} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  const PhotosReviewsTab = ({ charger, setSelectedCharger }) => {
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const { user, isLoggedIn, setUser } = useGlobalContext();
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const reviewsData = await getStationReviews(charger.id);
          setReviews(reviewsData);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
  
      const checkIfFavorite = () => {
        const isFav = user?.favorite_station_ids?.includes(charger.id);
        setIsFavorite(isFav);
      };
  
      fetchReviews();
      checkIfFavorite();
    }, [charger, user]);
  
    const handleReviewSubmitted = (newReview) => {
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    };
  
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <Image
            key={i}
            source={i <= rating ? icons.star : icons.starFilled}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
        );
      }
      return <View style={{ flexDirection: 'row' }}>{stars}</View>;
    };
    const handleFavoriteToggle = async () => {
      try {
        if (isFavorite) {
          await unfavoriteStation(charger.id);
          Alert.alert('Removed from Favorites');
          setUser((prevUser) => ({
            ...prevUser,
            favorite_station_ids: prevUser.favorite_station_ids.filter((id) => id !== charger.id),
          }));
        } else {
          await favoriteStation(charger.id);
          Alert.alert('Added to Favorites');
          setUser((prevUser) => ({
            ...prevUser,
            favorite_station_ids: [...prevUser.favorite_station_ids, charger.id],
          }));
        }
        setIsFavorite(!isFavorite);
      } catch (error) {
        console.error('Error updating favorite:', error);
        Alert.alert('Error', 'Could not update favorite status.');
      }
    };
    
    const renderReviewItem = ({ item }) => (
      <View key={item._id} style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.username || 'Anonymous'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          {renderStars(item.rating)}
          <Text style={{ fontSize: 14, color: 'gray', marginLeft: 8 }}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>{item.commentary}</Text>
      </View>
    );
  
    const ListHeader = () => (
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Charger Photos */}
        {charger.pictures && charger.pictures.length > 0 ? (
          charger.pictures.map((picture, index) => (
            <Image
              key={index}
              source={{ uri: picture }}
              style={{ width: '100%', height: 200, marginBottom: 16, borderRadius: 8 }}
              resizeMode="cover"
            />
          ))
        ) : (
          <Text>No photos available</Text>
        )}
  
        {/* Favorite Button */}
        {isLoggedIn && (
          <TouchableOpacity onPress={handleFavoriteToggle} style={{ alignItems: 'center', marginTop: 16 }}>
            <Image source={icons.bookmark} style={{ width: 32, height: 32 }} resizeMode="contain" />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>
              {isFavorite ? 'Unfavorite' : 'Favorite'}
            </Text>
          </TouchableOpacity>
        )}
  
        {/* Reviews Header */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 24, marginBottom: 16 }}>Reviews</Text>
      </View>
    );
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderReviewItem}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={250}
              style={{ paddingHorizontal: 16, paddingBottom: 16 }}
            >
              <ReviewForm charger={charger} onReviewSubmitted={handleReviewSubmitted} />
            </KeyboardAvoidingView>
          }
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </SafeAreaView>
    );
  };

  const ChargersListTab = ({ charger }) => {
    const chargers = charger.chargers || []; // Assuming 'charger.chargers' contains the list
    const navigation = useNavigation();
    const router = useRouter();
    
    const handleChargerPress = (selectedCharger) => {
      console.log(selectedCharger)
      router.push({
        pathname: '/ChargerDetails',
        params: {
          charger: JSON.stringify(selectedCharger), // Convert charger object to string
        },
      });
    };

    const handleStartCharging = (setSelectedCharger) => {
      const updatedCharger = { ...charger, isWorking: false };
      setSelectedCharger(updatedCharger);


      router.push({
        pathname: '/charging-session',
        params: {
          charger: updatedCharger,
        },
      }); 
    };
    return (
      <View className="flex-1 px-4 py-4">
        {chargers.length > 0 ? (
          <FlatList
            data={chargers}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleChargerPress(item)}>
                <View className="bg-white rounded-lg p-4 mb-4">
                  <Text className="text-lg font-bold">{item.name}</Text>
                  <Text className="text-base">{item.description}</Text>
                 
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          />
        ) : (
          <Text>No chargers available.</Text>
        )}
        {/* <TouchableOpacity onPress={handleStartCharging} className="items-center mt-20">
            <Image source={icons.charger} className="w-32 h-32" resizeMode="contain" />
            <Text className="text-lg font-sfbold text-center bottom-8">Charge your car</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  const ChargerDetailsSheet = ({ charger, setSelectedCharger }) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'photosReviews', title: 'Photos/Reviews' },
      { key: 'chargersList', title: 'List of Chargers' },
    ]);
  
    const renderScene = SceneMap({
      photosReviews: () => (
        <PhotosReviewsTab charger={charger} setSelectedCharger={setSelectedCharger} />
      ),
      chargersList: () => <ChargersListTab charger={charger} />,
    });
  
    const renderTabBar = (props) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'green', height: 3, width: '44%' }}
        style={{ backgroundColor: 'white' }}
        renderLabel={({ route, focused }) => (
          <Text className={`text-lg font-sfbold ${focused ? 'text-black' : 'text-gray-500'}`}>
            {route.title}
          </Text>
        )}
      />
    );
  
    return (
      <View className="mt-5 flex-1 bg-customWhite-200">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
        />
      </View>
    );
  };
  
  export default ChargerDetailsSheet;
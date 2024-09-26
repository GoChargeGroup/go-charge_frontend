import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { haversineDistance } from '@/utils/utils';
import { useNavigation } from '@react-navigation/native';
import { icons } from '@/constants';

const ChargerItem = ({ charger, userLocation, onPress, otherStyles }) => {
  const navigation = useNavigation();
  const userCoords = userLocation ? { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude } : null;
  const distance = userCoords ? haversineDistance(userCoords, { latitude: charger.latitude, longitude: charger.longitude }) : null;
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // const reviewsData = await getReviewsByChargerId(charger.$id);
        const reviewsData = [];
        if (reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          setAverageRating((totalRating / reviewsData.length).toFixed(1));
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [charger.$id]);

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
    <TouchableOpacity
      className="bg-customWhite-200 flex-row rounded-3xl overflow-hidden p-4 shadow-md"
      onPress={onPress}
    >
      <View className={`flex-1 ${otherStyles}`}>
        <View className="flex-row">
          <View className="flex-1">
              <View className="flex-row items-center mb-1">
                {renderStars(averageRating)}
              </View>
            <View className="flex-row mt-2 items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={icons.stancia}
                  className="w-6 h-6 p-4"
                />
                <Text className="font-sfbold text-xl text-black ml-2">{charger.name}</Text>
              </View>
              <Text className={`text-lg font-sfregular ${charger.isWorking ? 'text-green-100' : 'text-red-500'}`}>
                {charger.isWorking ? 'Free' : 'Closed'}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row justify-between items-start ">
          {charger.address && (
            <Text className="font-sfregular text-sm text-gray-500 ml-11">{charger.address}</Text>
          )}
          {charger.working_hours && (
            <Text className="font-sfregular text-sm text-gray-500">{charger.working_hours}</Text>
          )}
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <View className="flex-row items-center">
            <Image source={icons.kabel} className="w-6 h-6 p-4" />
            <Text className="font-sfbold text-xl ml-2">Description:</Text>
          </View>
          <Text className="font-sfregular text-sm text-green-100 text-base">{charger.price} USD kWt</Text>
        </View>
        <View className="flex-row justify-between items-center mt-1 ml-8">
          {charger.description && (
            <Text className="font-sfregular text-sm text-black ml-2">{charger.description}</Text>
          )}
          {charger.kWhTypes && charger.kWhTypes.value && (
            <Text className="font-sfregular text-sm text-black ml-2">{charger.kWhTypes.value}</Text>
          )}
          {distance !== null && (
            <Text className="font-sfregular text-sm text-black-200">{distance.toFixed(2)} km</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChargerItem;

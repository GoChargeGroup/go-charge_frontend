import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants';

const FavoriteStations = () => {
    const { favoriteChargers } = useLocalSearchParams();
    const [favoriteStations, setFavoriteStations] = useState([]);

    useEffect(() => {
        if (favoriteChargers) {
            setFavoriteStations(JSON.parse(favoriteChargers));
        }
    }, [favoriteChargers]);

    const renderStationItem = ({ item }) => (
        <View className="bg-white p-4 rounded-lg mb-4 border border-gray-300">
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
            <View className="flex-row mt-2 items-center">
                <Image source={icons.location} className="w-4 h-4 mr-2" />
                <Text className="text-gray-500">{item.address}</Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-4">Favorite Stations</Text>
            {favoriteStations.length > 0 ? (
                <FlatList
                    data={favoriteStations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderStationItem}
                />
            ) : (
                <Text className="text-lg text-gray-600">No favorite stations added yet.</Text>
            )}
        </View>
    );
};

export default FavoriteStations;

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, FlatList, Text } from 'react-native';
import { icons } from '../constants';
import axios from 'axios';

interface MapSearchBarProps {
  onSearch: (query: string) => void; 
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleInputChange = async (text: string) => {
    setQuery(text);

    const MAPBOX_API_KEY = process.env.EXPO_PUBLIC_REACT_APP_MAPBOX_API_KEY;
    const limit = 10; 
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${MAPBOX_API_KEY}&limit=${limit}`;

    try {
      const response = await axios.get(url);
      setSuggestions(response.data.features);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (selectedSuggestion: string) => {
    setQuery(selectedSuggestion);
    onSearch(selectedSuggestion); 
    setQuery('');
    setSuggestions([]); 
    Keyboard.dismiss(); 
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
  };

  const renderSuggestion = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleSuggestionSelect(item.place_name)}>
      <Text style={suggestionsStyles.suggestionText}>{item.place_name}</Text>
    </TouchableOpacity>
  );

  const renderSeparator = () => (
    <View style={suggestionsStyles.separator} />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={searchBarStyles.input}
            value={query}
            onChangeText={handleInputChange}
            placeholder="Search for a location..."
            placeholderTextColor="#7D7D7D"
            accessibilityLabel="Search"
            onSubmitEditing={() => onSearch(query)} 
          />
          <TouchableOpacity onPress={clearInput}>
            <Image 
              source={icons.x} 
              style={{ width: 20, height: 20, position: 'absolute', top: 10, right: 15 }} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={renderSuggestion}
            ItemSeparatorComponent={renderSeparator}
            style={suggestionsStyles.suggestionsList}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};


const searchBarStyles = StyleSheet.create({
  input: {
    width: '92%',
    minWidth: '92%',
    height: 40,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15, 
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#000', 
  },
});

const suggestionsStyles = StyleSheet.create({
  suggestionsList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: '85%',
    backgroundColor: '#fff',
    marginTop: 5, 
    width: "92%",
    minWidth: "92%",
  },
  suggestionText: {
    padding: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0', 
    width: '94%', 
    marginLeft: '3%'
  },
});

export default MapSearchBar;

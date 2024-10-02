import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Image, Animated, Text, TouchableOpacity } from 'react-native';
import { icons } from '../constants';

interface MapSearchBarProps {
  onSearch: (query: string) => void; // Function prop that takes a string
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleInputChange = (text: string) => {
    setQuery(text);
  };
  const clearInput = () => {
    setQuery('');
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={handleInputChange}
            placeholder="Search for a location..."
            placeholderTextColor="#7D7D7D"
            accessibilityLabel="Search"
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity onPress={clearInput}>
              <Image 
                  source={icons.x} 
                  style={{ width: 20, height: 20, position: 'absolute', top: 10, right: 0 }} 
                  resizeMode="contain" 
              />
          </TouchableOpacity>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '90%', // Fill the width of the parent
    height: 40, // Reasonable height for the input
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 25, // Rounded corners
    paddingHorizontal: 15, // Smaller padding value
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#000', // Text color
    marginHorizontal: -15, // Negative margin to offset the padding
},

});


export default MapSearchBar;

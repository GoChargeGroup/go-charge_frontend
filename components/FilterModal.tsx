import React, { useState } from 'react';
import { Modal, Image, View, Text, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import Slider from '@react-native-community/slider';
import { MultiSelect } from 'react-native-element-dropdown';
import { Checkbox } from 'expo-checkbox';
import { icons } from '@/constants';

const FilterModal = ({ isModalVisible, setModalVisible, applyOptions }) => {
  const [maxPrice, setMaxPrice] = useState(75);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(2.5);
  const [selectedPlugTypes, setSelectedPlugTypes] = useState(['type1', 'type2', 'ccs', 'chademo']);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [plugTypeItems, setPlugTypeItems] = useState([
    { label: 'Type 1', value: 'type1' },
    { label: 'Type 2', value: 'type2' },
    { label: 'CCS', value: 'ccs' },
    { label: 'CHAdeMO', value: 'chademo' },
  ]);

  const [powerLevels, setPowerLevels] = useState([
    { label: 'Level 1', value: 'level1', checked: true },
    { label: 'Level 2', value: 'level2', checked: true },
    { label: 'Level 3', value: 'level3', checked: true },
  ]);
  

  const [status, setStatus] = useState([
    { label: 'Not in Use', value: 'notInUse', checked: true },
    { label: 'Working', value: 'working', checked: true },
  ]);

  const [lastAppliedOptions, setLastAppliedOptions] = useState({
    maxPrice: 75,
    maxDistance: 50,
    minRating: 2.5,
    selectedPlugTypes: ['type1', 'type2', 'ccs', 'chademo'],
    powerLevels: [
      { label: 'Level 1', value: 'level1', checked: true },
      { label: 'Level 2', value: 'level2', checked: true },
      { label: 'Level 3', value: 'level3', checked: true },
    ],
    status: [
      { label: 'Not in Use', value: 'notInUse', checked: true },
      { label: 'Working', value: 'working', checked: true },
    ],
  });

  const resetToLastApplied = () => {
    setMaxPrice(lastAppliedOptions.maxPrice);
    setMaxDistance(lastAppliedOptions.maxDistance);
    setMinRating(lastAppliedOptions.minRating);
    setSelectedPlugTypes(lastAppliedOptions.selectedPlugTypes);
    setPowerLevels(lastAppliedOptions.powerLevels);
    setStatus(lastAppliedOptions.status);
  };

  const togglePowerLevel = (value) => {
    const updatedLevels = powerLevels.map(level =>
      level.value === value ? { ...level, checked: !level.checked } : level
    );
    setPowerLevels(updatedLevels);
  };

  const toggleStatus = (value) => {
    const updatedStatus = status.map(stat =>
      stat.value === value ? { ...stat, checked: !stat.checked } : stat
    );
    setStatus(updatedStatus);
  };

  const resetOptions = () => {
    setMaxPrice(75);
    setMaxDistance(50);
    setMinRating(2.5);
    setSelectedPlugTypes(['type1', 'type2', 'ccs', 'chademo']);
    setPowerLevels([
      { label: 'Level 1', value: 'level1', checked: true },
      { label: 'Level 2', value: 'level2', checked: true },
      { label: 'Level 3', value: 'level3', checked: true },
    ]);
    setStatus([
      { label: 'Not in Use', value: 'notInUse', checked: true },
      { label: 'Working', value: 'working', checked: true },
    ]);

    // Apply the reset options without closing modal
    applyOptions({ 
        maxPrice: 75, 
        maxDistance: 50, 
        minRating: 2.5,
        selectedPlugTypes: ['type1', 'type2', 'ccs', 'chademo'], 
        powerLevels: [
          { label: 'Level 1', value: 'level1', checked: true },
          { label: 'Level 2', value: 'level2', checked: true },
          { label: 'Level 3', value: 'level3', checked: true },
        ], 
        status: [
          { label: 'Not in Use', value: 'notInUse', checked: true },
          { label: 'Working', value: 'working', checked: true },
        ],
    });
  }

  const handleApply = () => {
    const newOptions = {
      maxPrice,
      maxDistance,
      minRating,
      selectedPlugTypes,
      powerLevels,
      status,
    };

    setLastAppliedOptions(newOptions);
    applyOptions(newOptions);
    setModalVisible(false);
  };
  
  const _renderItem = (item, selected) => {
    return (
      <View 
        style={{
          paddingVertical: 10,
          paddingHorizontal: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{ paddingLeft: 5, flex: 1, fontSize: 16 }}>{item.label}</Text>
          {selected && (
            <Image
              style={{
                marginRight: 5,
                width: 18,
                height: 18,
              }}
              source={icons.checkmark}
              resizeMode="contain"
            />
          )}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(!isModalVisible)}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <View style={{
          width: 300,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
              Search Options
            </Text>
            <TouchableOpacity onPress={() => {setModalVisible(false); resetToLastApplied();}}>
              <Image source={icons.x} style={{ width: 24, height: 24}} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Maximum Price Slider */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Maximum Price: {maxPrice}¢ per kWh</Text>
            <Slider
            minimumValue={1}
            maximumValue={100} // Maximum of 100 cents (or $1.00) per kWh
            step={1}
            value={maxPrice}
            onValueChange={value => setMaxPrice(value)}
            />

          {/* Maximum Distance Slider */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Maximum Distance: {maxDistance} miles</Text>
          <Slider
            minimumValue={1}
            maximumValue={150}
            step={1}
            value={maxDistance}
            onValueChange={value => setMaxDistance(value)}
          />

          {/* Minimum Ratings */}
          <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>Minimum Rating: {minRating} stars</Text>
          <Rating
            fractions={1}
            onFinishRating={(rating: any) => setMinRating(rating)}
          />

          {/* EV Charger Plug Types */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Plug Type:</Text>
          <MultiSelect
                    style={{ backgroundColor: 'white', borderBottomColor: 'gray', borderBottomWidth: 0.5, marginTop: 5, padding: 4 }}
                    data={plugTypeItems}
                    labelField="label"
                    valueField="value"
                    label="Multi Select"
                    placeholder="Select items"
                    value={selectedPlugTypes}
                    onChange={item => {
                      setSelectedPlugTypes(item);
                    }}
                    renderItem={item => _renderItem(item, selectedPlugTypes.includes(item.value))}
                    selectedStyle={{ borderRadius: 4, marginTop: 5, marginBottom: 0 }}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setDropdownOpen(false)} 
                />

          {/* Charger Power Output Level */}
          <Text style={[{ fontWeight: 'bold' }, 
                      selectedPlugTypes.length > 0 ? dropdownOpen? { marginTop:53 } : {marginTop: 15} : {marginTop: 15}  ]}>Power Output Level:</Text>
          {powerLevels.map(item => (
            <View key={item.value} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Checkbox
                style={{ marginRight: 5 }}
                value={item.checked}
                onValueChange={() => {
                  togglePowerLevel(item.value);
                }}
              />
              <Text>{item.label}</Text>
            </View>
          ))}

          {/* Status */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Status:</Text>
          {status.map(item => (
            <View key={item.value} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Checkbox
                style={{ marginRight: 5 }}
                value={item.checked}
                onValueChange={() => {
                  toggleStatus(item.value);
                }}
              />
              <Text>{item.label}</Text>
            </View>
          ))}

          <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity onPress={resetOptions}>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Reset Options</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply}>
              <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 16 }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

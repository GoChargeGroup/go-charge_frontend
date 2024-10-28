import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'expo-checkbox';

const FilterModal = ({ isModalVisible, setModalVisible, applyOptions }) => {
  // State for minimum price, max distance, plug types, power output levels, and status
  const [maxPrice, setMaxPrice] = useState(75);
  const [maxDistance, setMaxDistance] = useState(10);
  const [selectedPlugType, setSelectedPlugType] = useState('all');
  const [plugTypeOpen, setPlugTypeOpen] = useState(false);

  const [plugTypeItems, setPlugTypeItems] = useState([
    { label: 'All Plug Types', value: 'all' },
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
    { label: 'Not in Use', value: 'notInUse', checked: false },
    { label: 'Working', value: 'working', checked: false },
  ]);

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
          borderRadius: 10
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
            Search Options
          </Text>

          {/* Maximum Price Slider */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Maximum Price: {maxPrice}¢ per kWh</Text>
            <Slider
            minimumValue={0}
            maximumValue={100} // Maximum of 100 cents (or $1.00) per kWh
            step={1}
            value={maxPrice}
            onValueChange={value => setMaxPrice(value)}
            />

          {/* Maximum Distance Slider */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Maximum Distance: {maxDistance} miles</Text>
          <Slider
            minimumValue={1}
            maximumValue={50}
            step={1}
            value={maxDistance}
            onValueChange={value => setMaxDistance(value)}
          />

          {/* EV Charger Plug Types */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Plug Type:</Text>
          <DropDownPicker
            open={plugTypeOpen}
            value={selectedPlugType}
            items={plugTypeItems}
            setOpen={setPlugTypeOpen}
            setValue={setSelectedPlugType}
            setItems={setPlugTypeItems}
            containerStyle={{ height: 40 }}
            style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginTop: 5 }}
          />

          {/* Charger Power Output Level */}
          <Text style={{ fontWeight: 'bold', marginTop: 25 }}>Power Output Level:</Text>
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
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => applyOptions({ maxPrice, maxDistance, plugTypeItems, powerLevels, status })}>
              <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 16 }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

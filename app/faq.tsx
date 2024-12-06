import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { faqs } from './faqData'; 

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <ScrollView className="flex-1 p-4 bg-[#F6F6F7] top-5">
      <Text className="text-2xl font-bold mb-5 text-center">Frequently Asked Questions</Text>

      {faqs.map((faq, index) => (
        <View key={index} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
          <TouchableOpacity onPress={() => handleToggle(index)}>
            <Text className="text-[18px] font-semibold text-[#333]">{faq.question}</Text>
          </TouchableOpacity>

          {expandedIndex === index && (
            <Text className="text-base text-[#555] mt-2">{faq.answer}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default FAQ;
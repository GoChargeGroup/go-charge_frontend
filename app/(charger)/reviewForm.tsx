import { View, Text, Alert, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as ImagePicker from 'expo-image-picker';
import { useGlobalContext } from '@/context/GlobalProvider';
import { AntDesign } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { icons } from '@/constants';

const ReviewForm = ({ chargerId, onReviewSubmit}) => {
  const { user } = useGlobalContext();
  const [rating, setRating] = useState(0);
  
  const [form, setForm] = useState({
    charger_id: chargerId,
    user_id: user ? user.$id : '',
    rating: rating,
    commentary: '',
    photo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(prevForm => ({ ...prevForm, rating: rating }));
  }, [rating]);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/sign-in');
      Alert.alert('Ошибка', 'Авторизируйтесь для оставки отзыва');
      return;
    }
    if (!form.rating || !form.commentary) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
    setIsSubmitting(true);
    try {
    //   const newReview = await createReview(form);
      Alert.alert('Success', 'Your review has been submitted');
    //   onReviewSubmit(newReview);
      setRating(0);
      setForm({
        charger_id: chargerId,
        user_id: user ? user.$id : '',
        rating: 0,
        commentary: '',
        photo: '',
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const renderStars = (currentRating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
          <Image
            source={i < currentRating ? icons.star : icons.starFilled}
            className="w-6 h-6"
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  

  return (
    
        <View className="bg-white rounded-lg items-center px-2">
          <View className="flex-row items-start mb-4 self-start ml-4">
            <Text className="font-sfregular text-xl mr-2">Rating:</Text>
            {renderStars(rating)}
          </View>
         

          <FormField
            placeholder={"Your review..."}
            value={form.commentary}
            handleChangeText={(e) => handleChange('commentary', e)}
            otherStyles="rounded-lg text-lg border-2 border-gray-100 w-11/12"
            textStyles={"h-28"}
          
          />
        
          <CustomButton
            title="Send Review"
            handlePress={handleSubmit}
            containerStyles="mt-4"
            isLoading={isSubmitting}
          />
        </View>

  );
};

export default ReviewForm;

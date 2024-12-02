import { View, Text, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { icons } from '@/constants';
import { submitReview } from '@/lib/authService';

const ReviewForm = ({ charger, onReviewSubmitted }) => {
  const { user, isLoggedIn } = useGlobalContext();
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({
    station_id: charger.id,
    charger_id: charger.charger_id || null,
    rating: 0,
    commentary: '',
    photo_urls: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    
    setForm((prevForm) => ({ ...prevForm, rating }));
  }, [rating]);

  useEffect(() => {
    
    setForm((prevForm) => ({
      ...prevForm,
      station_id: charger.id,
      charger_id: charger.charger_id || null,
    }));
  }, [charger]);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      router.push('/sign-in');
      Alert.alert('Error', 'Please log in to submit a review.');
      return;
    }
    if (!form.rating || !form.commentary.trim()) {
      Alert.alert('Error', 'Please provide a rating and a commentary.');
      return;
    }
    setIsSubmitting(true);
    try {
      const newReview = await submitReview(form);
      Alert.alert('Success', 'Your review has been submitted.');
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }
      setRating(0);
      setForm({
        ...form,
        rating: 0,
        commentary: '',
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i+1)}>
          <Image
             source={i < currentRating ? icons.star : icons.starFilled}
            style={{ width: 24, height: 24, margin: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  return (
    <View className="bg-white rounded-lg items-center px-2">
      <View className="flex-row items-start mb-4 self-start ml-4">
        <Text className="font-sfregular text-xl mr-2">Rating:</Text>
        {renderStars(rating)}
      </View>
      <FormField
        placeholder="Your review..."
        value={form.commentary}
        handleChangeText={(e) => handleChange('commentary', e)}
        otherStyles="rounded-lg text-lg border-2 border-gray-100 w-11/12"
        textStyles="h-28"
        multiline
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
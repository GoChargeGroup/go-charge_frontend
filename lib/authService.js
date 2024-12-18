const BASE_URL = 'http://10.0.0.41:8083'; //use your IP address here
import AsyncStorage from '@react-native-async-storage/async-storage';
export const login = async (username, password) => {
  try {
    const queryParams = new URLSearchParams({
      username,
      password,
    }).toString();

    const response = await fetch(`${BASE_URL}/login?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Incorrect username or password');
    }

    const user = await response.json();
    
    const token = response.headers.get('Authorization');
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      throw new Error('Token not found in response');
    }

    console.log(user);
    console.log(token);

    return user; 
  } catch (error) {
    throw error; 
  }
};

export const signup = async (username, password, email, role, answers) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
        role: role || 'user',
        security_question_answers: answers
      }),
    });

    const user = await response.json();

    if (!response.ok) {
      throw new Error(`${user || 'Something went wrong'}`);
    }

    const token = response.headers.get('Authorization');
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      throw new Error('Token not found in response');
    }



    if (!response.ok) {
      throw new Error(user || 'Something went wrong during signup');
    }
    console.log(user);
    return user; 
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendEmailVerification = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/password-reset-request`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error('Could not find account. Please check your email and try again.');
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async (otp, password) => {
  try {
    const response = await fetch(`${BASE_URL}/password-reset`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: otp,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update password');
    }

    const token = response.headers.get('Authorization');
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      throw new Error('Token not found in response');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const sendDeleteVerification = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/user/delete-account-request`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error('Failed to send email verification. Please try again.');
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendEditUsernameVerification = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/user/edit-username-request`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error('Failed to send email verification. Please try again.');
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editUsername = async (otp, newUsername) => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${BASE_URL}/user/edit-username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      otp: otp,
      new_username: newUsername,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.message || 'Failed to edit the account username');
  }
};

export const editEmail = async (newEmail, answers) => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${BASE_URL}/user/edit-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      email: newEmail,
      security_question_answers: answers
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.message || 'Failed to edit the account username');
  }
};

export const editUser = async (userId, updates) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    console.log(token);
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}/user/edit-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`, 
      },
      body: JSON.stringify({
        username: updates.username,
        password: updates.password, 
        email: updates.email,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update the user');
    }
    const token2 = response.headers.get('Authorization');
    if (token2) {
      await AsyncStorage.setItem('authToken', token2);
    } else {
      throw new Error('Token not found in response');
    }
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (otp) => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${BASE_URL}/user/delete-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      otp: otp,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.message || 'Failed to delete the account');
  }
};

export const getChargingStations = async (options) => {
  try {
    const token = await AsyncStorage.getItem('authToken');

    // Build the request body dynamically
    const requestBody = {
      coordinates: options.coordinates,
      max_radius: options.max_radius,
      max_results: options.max_results,
    };

    // Include optional filters if they are set
    if (options.status) requestBody.statuses = options.status;
    if (options.power_output) requestBody.power_outputs = options.power_output;
    if (options.plug_type) requestBody.plug_types = options.plug_type;
    if (options.max_price !== undefined) requestBody.max_price = options.max_price;
    if (options.min_rating !== undefined) requestBody.min_rating = options.min_rating;

    const response = await fetch(`${BASE_URL}/user/closest-stations`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting charging stations');
    }

    const results = await response.json();
   
    return results; 
  } catch (error) {
    throw error;
  }
};


export const logout = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
  
    const response = await fetch(`${BASE_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    });
    await AsyncStorage.removeItem('authToken'); 
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
export const favoriteStation = async (stationId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
    console.log("StationID sent:", stationId);  

    const response = await fetch(`${BASE_URL}/user/favorite-station`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify({
        station_id: stationId,
      }),      
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add station to favorites');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error favoriting station:', error);
    throw error;
  }
};

export const unfavoriteStation = async (stationId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/user/unfavorite-station`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify({
        station_id: stationId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove station from favorites');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error unfavoriting station:', error);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/user/review-station`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit review');
    }

    const newReview = await response.json();
    return newReview;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getStationReviews = async (stationId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/user/station-reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify({ station_id: stationId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch reviews');
    }

    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};
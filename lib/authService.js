const BASE_URL = 'http://10.186.114.110:8083'; //use your IP address here
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
      throw new Error(errorData.message || 'Something went wrong');
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

  export const signup = async (username, password, email, role) => {
    try {
      const queryParams = new URLSearchParams({
        username,
        password,
        email,
        role: role || 'user',
      }).toString();

      const response = await fetch(`${BASE_URL}/signup?${queryParams}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
      const user = await response.json();
  
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
  
      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };
  

  export const deleteUser = async () => {
    const token = await AsyncStorage.getItem('authToken');
   
    if (!token) throw new Error('No authentication token found');
  
    const response = await fetch(`${BASE_URL}/user/delete-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || 'Failed to delete the account');
    }
  };
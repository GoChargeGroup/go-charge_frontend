const BASE_URL = 'http://10.186.120.233:8083'; //use your IP address here
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
  
      const user = await response.json();
  
      if (!response.ok) {
        throw new Error(user || 'Something went wrong');
      }
  
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


  
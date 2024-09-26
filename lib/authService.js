const BASE_URL = 'http://192.168.1.45'; //use your IP address here
export const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8083/login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
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
      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          role: role || 'user', 
        }),
      });
  
      const user = await response.json();
  
      if (!response.ok) {
        throw new Error(user || 'Something went wrong during signup');
      }
      console.log(user);
      return user; 
    } catch (error) {
      throw error;
    }
  };


  
import React, { createContext, useState, useContext, useEffect } from 'react';
import Loader from '../Utiles/Loader';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUser(parsedUser);
      } catch (error) {
        setUser('');
      }
    } else {
      setUser('');
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.clear(); 
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
};

export const UserState = () => {
  return useContext(UserContext);
}

export default UserProvider;

import React, { useState } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const defineUser = payload => {
    setUser(payload);
  };

  return (
    <UserContext.Provider value={{ data: user, defineUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

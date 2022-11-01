import { createContext, useState, useEffect } from "react";
import { CONNECT_KEY } from "../lib/constants";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userConnected, setUserConnected] = useState(null);

  useEffect(() => {
    const userString = window.localStorage.getItem(CONNECT_KEY);

    try {
      const userData = JSON.parse(userString);

      if (!!userData) {
        setIsConnected(true);
        setUserConnected(userData);
      } else {
        setIsConnected(false);
      }
    } catch {
      setIsConnected(false);
    }
  }, []);

  const connect = (user) => {
    window.localStorage.setItem(CONNECT_KEY, JSON.stringify(user));
    setIsConnected(true);
    setUserConnected(user);
  };

  const disconnect = () => {
    window.localStorage.setItem(CONNECT_KEY, null);
    setIsConnected(false);
    setUserConnected(null);
  };

  const checkPasscode = (passcode, users) => {
    const user = users.find((user) => user.pin === passcode);
    if (user) {
      connect(user);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ isConnected, connect, disconnect, checkPasscode, userConnected }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

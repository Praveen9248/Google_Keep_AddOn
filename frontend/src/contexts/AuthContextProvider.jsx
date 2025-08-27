import { useContext, createContext, useState, useEffect } from "react";
import authService from "../appwrite/AuthService";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [status, setStatus] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res) {
        setUser(res);
        setStatus(true);
      } else {
        setUser(null);
        setStatus(false);
      }
    } catch (error) {
      setUser(null);
      setStatus(false);
    }
  };

  const loginUserOAuth = () => {
    const res = authService.loginOAuth();

    if (res) {
      setUser(res);
      setStatus(true);
      return true;
    }
    return false;
  };

  const loginUser = async (credentials) => {
    const res = await authService.login(credentials);
    if (res) {
      setUser(res);
      setStatus(true);
      return true;
    }
    return false;
  };

  const logoutUser = async () => {
    try {
      const res = await authService.logout();
      if (res) {
        setUser(null);
        setStatus(false);
        return true;
      }
      return false;
    } catch (error) {
      console.log("logout failed : ", error);
      return false;
    }
  };

  const registerUser = async ({ email, password, name }) => {
    const res = await authService.createAccount({ email, password, name });
    if (res) {
      setUser(res);
      setStatus(true);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        registerUser,
        loginUser,
        logoutUser,
        loginUserOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

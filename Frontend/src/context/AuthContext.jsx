import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser as loginApi,
  logoutUser as logoutApi,
  registerUser as registerApi,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (formData) => {
    const response = await registerApi(formData);
    return response.data;
  };

  const login = async (formData) => {
    const response = await loginApi(formData);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        register,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser as loginApi,
  logoutUser as logoutApi,
  registerUser as registerApi,
  updateCurrentUser as updateCurrentUserApi,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      const currentUser = response?.data?.user || null;

      setUser(currentUser);

      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
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
    const loggedInUser = response?.data?.user || null;

    setUser(loggedInUser);

    if (loggedInUser) {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    }

    return response.data;
  };

  const updateProfile = async (formData) => {
    const response = await updateCurrentUserApi(formData);
    const updatedUser = response?.data?.user || null;

    setUser(updatedUser);

    if (updatedUser) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return response.data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
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
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
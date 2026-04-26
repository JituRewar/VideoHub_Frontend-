import { createContext, useContext, useState, useEffect } from "react";
import { API } from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const fetchUser = async () => {
  try {
    const res = await API.get("/v1/users/current-user");
  
    setUser(res.data.data); 
  } catch (error) {
    console.log("FETCH USER ERROR:", error);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

 const login = async () => {
  await fetchUser() 
}

  const logout = async () => {
    try {
      await API.post("/v1/users/logout");
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
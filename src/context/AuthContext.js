import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("freshmart_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ login with email + role
  const login = (email, role) => {
    const u = { email, role };
    setUser(u);
    localStorage.setItem("freshmart_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("freshmart_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

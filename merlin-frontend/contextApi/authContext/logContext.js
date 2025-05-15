import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check if User has Cookies to Stay logged
  const persist = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/persist`);
    if (res.status == 200) {
      const set = await res.json();
      setUser(set.user);
      console.log(user);
    }
  };
  useEffect(() => {
    persist();
  }, []);

  const userLog = async (object) => {
    await setUser(object);
    console.log(object);
  };

  const logout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/logout`, {
      method: "POST",
    });
    if (res.status !== 200) {
      return false;
    }
    setUser(null);
    return true;
  };
  return (
    <AuthContext.Provider value={{ user, userLog, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

const C = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("sohoj_user") || "null");
  } catch {
    localStorage.removeItem("sohoj_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("sohoj_token")) {
      setLoading(false);
      return;
    }

    authApi.me()
      .then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("sohoj_user", JSON.stringify(data.user));
        } else {
          throw new Error("Invalid user response");
        }
      })
      .catch(() => {
        localStorage.removeItem("sohoj_token");
        localStorage.removeItem("sohoj_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function save(data) {
    if (!data?.token || !data?.user) throw new Error("Invalid authentication response");
    localStorage.setItem("sohoj_token", data.token);
    localStorage.setItem("sohoj_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(values) {
    const { data } = await authApi.login(values);
    save(data);
    return data;
  }

  async function register(values) {
    const { data } = await authApi.register(values);
    save(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("sohoj_token");
    localStorage.removeItem("sohoj_user");
    setUser(null);
  }

  return (
    <C.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);

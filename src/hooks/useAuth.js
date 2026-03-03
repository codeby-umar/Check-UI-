// src/hooks/useAuth.js
import { useState } from "react";
import { USERS } from "../data/mockData";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const login = (login, pass) => {
    const found = USERS.find(u => u.login === login && u.pass === pass);
    if (!found) {
      setError("Login yoki parol noto'g'ri");
      return false;
    }
    // Student kirishi bloklangan
    if (found.role === "student") {
      setError("O'quvchilar bu tizimga kira olmaydi");
      return false;
    }
    setError("");
    setUser(found);
    return true;
  };

  const logout = () => setUser(null);

  return { user, error, setError, login, logout };
}

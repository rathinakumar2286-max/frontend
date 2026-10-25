import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  // Restore the session when the page loads.
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    authService
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  // The API layer fires this when the server rejects the token.
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const finishAuth = useCallback(({ user: u, token }) => {
    localStorage.setItem("token", token);
    setUser(u);
    return u;
  }, []);

  const login = useCallback((payload) => authService.login(payload).then(finishAuth), [finishAuth]);
  const register = useCallback((payload) => authService.register(payload).then(finishAuth), [finishAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

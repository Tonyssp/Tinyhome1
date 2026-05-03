"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  getMe,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  type LoginInput,
  type RegisterInput,
} from "@/services/auth";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const result = await refreshToken();

        if (!mounted) {
          return;
        }

        setUser(result.user);
        setAccessToken(result.accessToken);
      } catch {
        if (!mounted) {
          return;
        }

        setUser(null);
        setAccessToken(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(input: LoginInput) {
    setLoading(true);

    try {
      const result = await loginUser(input);
      const currentUser = await getMe(result.accessToken);

      setUser(currentUser);
      setAccessToken(result.accessToken);

      return currentUser;
    } finally {
      setLoading(false);
    }
  }

  async function register(input: RegisterInput) {
    setLoading(true);

    try {
      const result = await registerUser(input);
      const currentUser = await getMe(result.accessToken);

      setUser(currentUser);
      setAccessToken(result.accessToken);

      return currentUser;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);

    try {
      if (accessToken) {
        await logoutUser(accessToken);
      }
    } finally {
      setUser(null);
      setAccessToken(null);
      setLoading(false);
    }
  }

  async function refreshSession() {
    setLoading(true);

    try {
      const result = await refreshToken();
      setUser(result.user);
      setAccessToken(result.accessToken);
      return result.user;
    } catch {
      setUser(null);
      setAccessToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

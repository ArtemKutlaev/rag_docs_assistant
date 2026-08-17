import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type AuthContextValue = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('access_token'),
  );

  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem('username'),
  );

  function setAuth(newToken: string, newUsername: string) {
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('username', newUsername);

    setToken(newToken);
    setUsername(newUsername);
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');

    setToken(null);
    setUsername(null);
  }

  const value = useMemo(
    () => ({
      token,
      username,
      isAuthenticated: Boolean(token),
      setAuth,
      logout,
    }),
    [token, username],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }

  return context;
}
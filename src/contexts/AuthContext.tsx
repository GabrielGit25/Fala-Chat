import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  attendantName: string;
  login: (name: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  attendantName: '',
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [attendantName, setAttendantName] = useState(
    () => sessionStorage.getItem('attendant_name') || '',
  );

  const login = (name: string) => {
    sessionStorage.setItem('attendant_name', name);
    setAttendantName(name);
  };

  const logout = () => {
    sessionStorage.removeItem('attendant_name');
    setAttendantName('');
  };

  return (
    <AuthContext.Provider
      value={{ attendantName, login, logout, isLoggedIn: !!attendantName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

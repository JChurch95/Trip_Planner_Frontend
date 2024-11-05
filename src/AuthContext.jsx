console.log('AuthContext.jsx - Start of file');
import { createContext, useState, useEffect, useContext } from "react";
import supabase from "./supabase";

const AuthContext = createContext();
console.log('AuthContext created:', AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const updateSession = (access_token, user_id) => {
    setToken(access_token);
    setUser(user_id);
    sessionStorage.setItem("sb-access-token", access_token);
    sessionStorage.setItem("sb-user", user_id);
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("sb-access-token");
    sessionStorage.removeItem("sb-user");
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ERROR: ", error);
    }
    return { error };
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        updateSession(session.access_token, session.user.id);
      }
      if (!session && event === "SIGNED_OUT") {
        clearSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

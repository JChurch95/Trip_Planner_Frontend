import { createContext, useState, useEffect, useContext } from "react";
import supabase from "./supabase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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
    clearSession();
    return { error };
  };

  useEffect(() => {
    // Initial session check
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          updateSession(session.access_token, session.user.id);
        } else {
          clearSession();
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
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

  // Prevent rendering until initial session check is complete
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

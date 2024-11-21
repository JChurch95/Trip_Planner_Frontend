import { createContext, useState, useEffect, useContext } from "react";
import supabase from "./supabase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateSession = (session) => {
    if (session) {
      // Extract the token
      const token = session.access_token;
      const userId = session.user.id;

      if (!token) {
        console.error('No access token found in session');
        return;
      }

      // Store the raw token without 'Bearer'
      setToken(token);
      setUser(userId);
      sessionStorage.setItem("sb-access-token", token);
      sessionStorage.setItem("sb-user", userId);
    }
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("sb-access-token");
    sessionStorage.removeItem("sb-user");
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout ERROR: ", error);
        return { error };
      }
      clearSession();
      return { error: null };
    } catch (error) {
      console.error("Logout ERROR: ", error);
      return { error };
    }
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
          updateSession(session);
        } else {
          console.log('No valid session found');
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

      if (session?.access_token) {
        updateSession(session);
      } else if (event === "SIGNED_OUT") {
        clearSession();
      }
    });

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Create the context value object
  const contextValue = {
    user,
    token,
    logout,
    loading
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>
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

// In your AuthContext
const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  setUser(data.user);
  setToken(data.token);
};

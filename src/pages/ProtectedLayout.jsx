import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import NavBar from "../components/NavBar";


const ProtectedLayout = () => {
    const { user, token } = useAuth();

    if (!token && !user) {
        return <Navigate to="/login" replace />;
    }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
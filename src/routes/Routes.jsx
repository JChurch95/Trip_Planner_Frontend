import { Navigate } from 'react-router-dom';
import Layout from '../pages/Layout';
import Home from '../routes/Home';
import Itinerary from '../routes/Itinerary';
import UserProfile from '../routes/Profile';
import MyTrips from '../routes/MyTrips';
import Login, { action as loginAction } from '../routes/Login';
import Registration, { action as registrationAction } from '../routes/Registration';
import Error from '../pages/Error';
import { useAuth } from '../AuthContext';

// Protected Layout wrapper component
const ProtectedLayout = ({ children }) => {
  const { user, token } = useAuth();
  
  if (!user || !token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Auth wrapper to redirect authenticated users away from login/register
const AuthLayout = ({ children }) => {
  const { user, token } = useAuth();
  
  if (user && token) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Define public routes configuration
export const publicRoutes = [
  {
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedLayout>
            <Home />
          </ProtectedLayout>
        ),
      },
      {
        path: "/my-trips",
        element: (
          <ProtectedLayout>
            <MyTrips />
          </ProtectedLayout>
        ),
      },
      {
        path: "/itinerary/:tripId",
        element: (
          <ProtectedLayout>
            <Itinerary />
          </ProtectedLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedLayout>
            <UserProfile />
          </ProtectedLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
        action: loginAction,
      },
      {
        path: "/registration",
        element: (
          <AuthLayout>
            <Registration />
          </AuthLayout>
        ),
        action: registrationAction,
      },
      // Catch all route - redirect to login if not authenticated
      {
        path: "*",
        element: <Navigate to="/login" replace />
      }
    ],
  },
];
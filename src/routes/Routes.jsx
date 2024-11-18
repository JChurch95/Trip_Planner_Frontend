import { Navigate } from 'react-router-dom';

// Page Layouts
import Layout from '../pages/Layout';
import Error from '../pages/Error';

// Route Components
import Home from '../routes/Home';
import Itinerary from '../routes/Itinerary';
import UserProfile from '../routes/Profile';
import MyTrips from '../routes/MyTrips';
import Login, { action as loginAction } from '../routes/Login';
import Registration, { action as registrationAction } from '../routes/Registration';
import DirectionalTransition from '../components/DirectionalTransition';

// Context and Utilities
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
          <DirectionalTransition>
            <ProtectedLayout>
              <Home />
            </ProtectedLayout>
          </DirectionalTransition>
        ),
      },
      {
        path: "/my-trips",
        element: (
          <DirectionalTransition>
            <ProtectedLayout>
              <MyTrips />
            </ProtectedLayout>
          </DirectionalTransition>
        ),
      },
      {
        path: "/itinerary/:tripId",
        element: (
          <DirectionalTransition>
            <ProtectedLayout>
              <Itinerary />
            </ProtectedLayout>
          </DirectionalTransition>
        ),
      },
      {
        path: "/profile",
        element: (
          <DirectionalTransition>
            <ProtectedLayout>
              <UserProfile />
            </ProtectedLayout>
          </DirectionalTransition>
        ),
      },
      {
        path: "/login",
        element: (
          <DirectionalTransition>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </DirectionalTransition>
        ),
        action: loginAction,
      },
      {
        path: "/registration",
        element: (
          <DirectionalTransition>
            <AuthLayout>
              <Registration />
            </AuthLayout>
          </DirectionalTransition>
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
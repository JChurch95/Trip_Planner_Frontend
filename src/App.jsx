import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from "./AuthContext";
// Import your routes file - you'll need to create this
import { publicRoutes } from "./routes/Routes";

const router = createBrowserRouter(publicRoutes);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from "./AuthContext";
import { publicRoutes } from "./routes/Routes";

const router = createBrowserRouter(publicRoutes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthProvider from "./AuthContext";
import { publicRoutes } from "./routes/Routes";

const router = createBrowserRouter(publicRoutes);

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
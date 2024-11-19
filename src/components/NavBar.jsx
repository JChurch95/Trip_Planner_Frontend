import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Menu, X } from "lucide-react";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsScrolled(currentScrollPos > 20);
      
      // Only show navbar when user is at the very top
      if (currentScrollPos < 10) {
        setVisible(true);
        setPrevScrollPos(currentScrollPos);
        return;
      }

      // Keep navbar hidden until user reaches top
      setVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/login");
    }
  };

  if (!user || !token) {
    return null;
  }

  const navItems = ["Plan Trip", "My Trips", "Profile"];

  const isActiveRoute = (item) => {
    const path = `/${item.toLowerCase().replace(" ", "-")}`;
    return (
      location.pathname === path ||
      (item === "Plan Trip" && location.pathname === "/") ||
      (item === "My Trips" && location.pathname.includes("/itinerary"))
    );
  };
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ 
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      } ${styles['content-shift']} ${!visible ? styles['navbar-hidden'] : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center py-6">
          <Link to="/" className="group">
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 relative"
              >
                <div className="w-full h-full animate-gradient rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-16 h-16 text-white transform translate-y-1"
                  >
                    {/* Bunny SVG paths remain the same */}
                    <path
                      fill="currentColor"
                      d="M50 25
                         C 75 25, 85 40, 85 60
                         C 85 80, 70 85, 50 85
                         C 30 85, 15 80, 15 60
                         C 15 40, 25 25, 50 25"
                    />
                    <path
                      fill="currentColor"
                      d="M35 25
                         C 35 5, 10 0, 25 -5
                         C 20 -5, 15 5, 20 25
                         C 25 50, 35 35, 35 25
                         M65 25
                         C 65 5, 90 0, 75 -5
                         C 80 -5, 85 5, 80 25
                         C 75 50, 65 35, 65 25"
                    />
                    <circle cx="35" cy="55" r="4" fill="#333" />
                    <circle cx="65" cy="55" r="4" fill="#333" />
                    <path
                      fill="#FF9999"
                      d="M50 62
                         C 53 62, 55 64, 55 66
                         C 55 68, 53 70, 50 70
                         C 47 70, 45 68, 45 66
                         C 45 64, 47 62, 50 62"
                    />
                    <path
                      fill="currentColor"
                      d="M47 70
                         L47 74
                         L49 74
                         L49 70
                         M51 70
                         L51 74
                         L53 74
                         L53 70"
                    />
                    <path
                      stroke="#333"
                      strokeWidth="1"
                      fill="none"
                      d="M30 65 L15 60
                         M30 67 L15 67
                         M30 69 L15 74
                         M70 65 L85 60
                         M70 67 L85 67
                         M70 69 L85 74"
                    />
                    <circle cx="30" cy="65" r="3" fill="#FFB6C1" opacity="0.5" />
                    <circle cx="70" cy="65" r="3" fill="#FFB6C1" opacity="0.5" />
                  </svg>
                </div>
              </motion.div>
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent">
                  Rabbit Route
                </h1>
                <p className="text-sm text-black mt-1">
                  Your AI Itinerary Planner
                </p>
              </div>
            </div>
          </Link>
        </div>
        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="flex justify-center items-center space-x-8 py-4">
            {navItems.map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    isActiveRoute(item)
                      ? "animate-gradient text-white shadow-lg hover:shadow-xl"
                      : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <motion.div whileHover={{ y: -2, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="px-6 py-2 rounded-full font-medium transition-all text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                onClick={handleLogout}
              >
                Hop Out
              </button>
            </motion.div>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden absolute top-4 right-4 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                      isActiveRoute(item)
                        ? "bg-gradient-to-r from-green-500 to-orange-500 text-white"
                        : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <button
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Hop Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavBar;

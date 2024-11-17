import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NavBar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    return location.pathname === path || 
      (item === "Plan Trip" && location.pathname === "/") ||
      (item === "My Trips" && location.pathname.includes("/itinerary"));
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-16 h-16 relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-full h-full bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center"
              >
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-white">
                  {/* Main bunny face - smoother connection with ears */}
                  <path
                    fill="currentColor"
                    d="M50 25
                       C 75 25, 85 40, 85 60
                       C 85 80, 70 85, 50 85
                       C 30 85, 15 80, 15 60
                       C 15 40, 25 25, 50 25"
                  />
                  {/* Longer ears that connect smoothly to head */}
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
                  {/* Cute eyes */}
                  <circle cx="35" cy="55" r="4" fill="#333"/>
                  <circle cx="65" cy="55" r="4" fill="#333"/>
                  {/* Sweet nose */}
                  <path
                    fill="#FF9999"
                    d="M50 62
                       C 53 62, 55 64, 55 66
                       C 55 68, 53 70, 50 70
                       C 47 70, 45 68, 45 66
                       C 45 64, 47 62, 50 62"
                  />
                  {/* Two front teeth */}
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
                  {/* Whiskers */}
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
                  {/* Rosy cheeks */}
                  <circle cx="30" cy="65" r="3" fill="#FFB6C1" opacity="0.5"/>
                  <circle cx="70" cy="65" r="3" fill="#FFB6C1" opacity="0.5"/>
                </svg>
              </motion.div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent">
                Rabbit Route
              </span>
              <span className="text-sm text-gray-500">Your AI Itinerary Planner</span>
            </div>
          </Link>
          
          {/* Center the nav items with absolute positioning */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8">
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
                      ? "bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-lg hover:shadow-xl"
                      : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full font-medium transition-all text-gray-700 hover:text-orange-500 hover:bg-gray-50"
            onClick={handleLogout}
          >
            Hop Out
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
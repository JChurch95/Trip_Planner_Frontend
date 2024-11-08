import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useAuth } from "../AuthContext";

const NavBar = () => {
  console.log("NavBar component being initialized");
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/login");
    }
  };

  // If user is not logged in, don't show the navbar at all
  if (!user || !token) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link to="/" className={styles.logo}>
            Trip Planner ✈️
          </Link>

          <div className={styles.navLinksContainer}>
            <ul className={styles.navLinks}>
              {/* Only show these links when user is logged in */}
              <li>
                <Link to="/" className={styles.navLink}>
                  Plan Trip
                </Link>
              </li>

              <li>
                <Link to="/my-trips" className={styles.navLink}>
                  My Trips
                </Link>
              </li>
              <li>
                <Link to="/profile" className={styles.navLink}>
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.button}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

console.log("NavBar component:", NavBar);
export default NavBar;
console.log("NavBar.jsx - After export");

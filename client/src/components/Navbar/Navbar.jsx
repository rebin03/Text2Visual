import styles from "./styles.module.css";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    secureLocalStorage.removeItem("userId");
    navigate("/login", { replace: true });
    // window.location.replace("/login");
    // window.location.reload();
  };
  
  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.left_container}>
          <div className={styles.logo_container}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>
          <div className={styles.nav_links}>
            <Link to="/generate" className={styles.nav_link}>
              Generate
            </Link>
            <Link to="/gallery" className={styles.nav_link}>
              Gallery
            </Link>
          </div>
        </div>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
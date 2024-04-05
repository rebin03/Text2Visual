import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const NavbarEdit = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
    // window.location.replace("/login");
    // window.location.reload();
  };
  
  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.left_container}>
          <div className={styles.logo_container}>
            <Link to="/gallery" className={styles.nav_link}>
                <FontAwesomeIcon icon={faArrowLeft} className={styles.icon}/>
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

export default NavbarEdit;

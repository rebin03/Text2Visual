import styles from "./styles.module.css";
import logo from "../../images/logo.png";

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  
  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.left_container}>
          <div className={styles.logo_container}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>
          <div className={styles.nav_links}>
            <a href="#" className={styles.nav_link}>Generate</a>
            <a href="#" className={styles.nav_link}>Gallery</a>
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

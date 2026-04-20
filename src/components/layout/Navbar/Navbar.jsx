import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import styles from "./Navbar.module.scss";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;

    navigate(`/search?query=${encodeURIComponent(query)}`);
    setSearch("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      
      
      <div
        className={styles.logo}
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
      >
        BAZARIO
      </div>

      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

  
      <div className={styles.actions}>
        {!user ? (
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <div className={styles.userWrapper}>
            
            
            <div
              className={styles.avatar}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {user?.email?.charAt(0) || "U"}
            </div>

          
            {menuOpen && (
              <div className={styles.dropdown}>
                <div onClick={() => navigate("/profile")}>Profile</div>
                <div onClick={() => navigate("/orders")}>Orders</div>
                <div onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
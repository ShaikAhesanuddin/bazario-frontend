import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      
      <div className={styles.container}>
        
      
        <div className={styles.section}>
          <h2 className={styles.logo}>BAZARIO</h2>
          <p className={styles.tagline}>
            Your one-stop shop for everything.
          </p>
        </div>

  
        <div className={styles.section}>
          <h4 className={styles.heading}>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/">Search</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className={styles.section}>
          <h4 className={styles.heading}>Support</h4>
          <p>Email: support@bazario.com</p>
          <p>Phone: +91 7381203954</p>
        </div>

     
        <div className={styles.section}>
          <h4 className={styles.heading}>Why Choose Us</h4>
          <p>✔ Secure Payments</p>
          <p>✔ Fast Delivery</p>
          <p>✔ Easy Returns</p>
        </div>

      </div>

     
      <div className={styles.bottom}>
        © {new Date().getFullYear()} BAZARIO. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;
import { useState, useContext, useEffect } from "react";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import Loader from "../../components/common/Loader/Loader";

function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(form);
      login(response.data);
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className={styles.container}>
      {loading && <Loader />}  
      <div className={styles.card}>


        <h1 className={styles.logo}>BAZARIO</h1>

        <h2 className={styles.heading}>Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className={styles.input}
          />


          <div className={styles.forgotWrapper}>
            <Link to="/forgot-password" className={styles.forgot}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? <span className={styles.spinnerSmall}></span> : "Login"}
          </button>
        </form>


        <p className={styles.secureText}>
          🔒 Your data is secure and encrypted
        </p>


        <p className={styles.text}>
          Don’t have an account?{" "}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
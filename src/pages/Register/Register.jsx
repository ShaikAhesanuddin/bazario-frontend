import { useState, useEffect, useContext } from "react";
import { registerUser } from "../../services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/common/Loader/Loader";

function Register() {
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
    });


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate("/");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

         if (loading) return; 

        if (!form.email || !form.password) {
            toast.error("Email and password are required");
            return;
        }

        if (form.phone && form.phone.length !== 10) {
            toast.error("Phone must be 10 digits");
            return;
        }

        try {
            setLoading(true);

            await registerUser(form);

            toast.success("Registered successfully");
            navigate("/login");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Registration failed"
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

                <h2 className={styles.heading}>Create Account</h2>

                <form onSubmit={handleSubmit} className={styles.form}>

                    <div className={styles.row}>
                        <input
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={(e) =>
                                setForm({ ...form, firstName: e.target.value })
                            }
                            className={styles.input}
                        />

                        <input
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm({ ...form, lastName: e.target.value })
                            }
                            className={styles.input}
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email *"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password *"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        className={styles.input}
                    />

                    <input
                        placeholder="Phone (10 digits)"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                        className={styles.input}
                    />

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? <span className={styles.spinnerSmall}></span> : "Register"}
                    </button>
                </form>


                <p className={styles.secureText}>
                    🔒 Your data is safe and encrypted
                </p>


                <p className={styles.text}>
                    Already have an account?{" "}
                    <Link to="/login" className={styles.link}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
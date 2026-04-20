import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
} from "../../services/userService";
import Navbar from "../../components/layout/Navbar/Navbar";
import Loader from "../../components/common/Loader/Loader";
import { toast } from "react-toastify";
import AddressSection from "./AddressSection";
import styles from "./Profile.module.scss";
import Footer from "../../components/layout/Footer/Footer"; 

function Profile() {
  const { user, logout } = useContext(AuthContext);

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyProfile();
        setForm(res.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateMyProfile(form);
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete account permanently?")) return;

    try {
      await deleteMyProfile();
      logout();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

     
        <div className={styles.card}>
          <h2 className={styles.heading}>My Profile</h2>

          <div className={styles.form}>
            <div className={styles.row}>
              <input
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={styles.input}
              />
              <input
                value={form.lastName || ""}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                className={styles.input}
              />
            </div>

            <input
              value={form.email || ""}
              disabled
              className={styles.inputDisabled}
            />

            <input
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className={styles.input}
            />

            <button onClick={handleUpdate} className={styles.primaryBtn}>
              Save Changes
            </button>

            <button onClick={handleDelete} className={styles.deleteBtn}>
              Delete Account
            </button>
          </div>
        </div>

       
        <div className={styles.addressSection}>
          <AddressSection />
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Profile;
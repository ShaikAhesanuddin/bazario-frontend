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

const getErrorMessage = (err) => {
  if (typeof err.response?.data === "string") {
    return err.response.data;
  }

  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Something went wrong"
  );
};

function Profile() {
  const { logout } = useContext(AuthContext);

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyProfile();
        setForm(res.data || {});
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      await updateMyProfile(form);

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete account permanently?")) return;

    try {
      setDeleting(true);

      await deleteMyProfile();

      toast.success("Account deleted");
      logout();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
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
                placeholder="First Name"
              />

              <input
                value={form.lastName || ""}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                className={styles.input}
                placeholder="Last Name"
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
              placeholder="Phone Number"
            />

            <button
              onClick={handleUpdate}
              className={styles.primaryBtn}
              disabled={updating}
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleDelete}
              className={styles.deleteBtn}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
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
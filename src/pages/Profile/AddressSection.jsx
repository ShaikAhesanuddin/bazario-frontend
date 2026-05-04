import { useEffect, useState } from "react";
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
  addAddress,
} from "../../services/addressService";
import styles from "./Address.module.scss";
import Loader from "../../components/common/Loader/Loader";
import { toast } from "react-toastify";


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

function AddressSection({ selectable = false, onSelect, allowAdd = true }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const initialState = {
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
    landmark: "",
    addressType: "HOME",
    isDefault: false,
  };

  const [newAddress, setNewAddress] = useState(initialState);

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      const data = res.data || [];
      setAddresses(data);

      if (selectable && data.length) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        setSelectedAddress(defaultAddr.id);
        onSelect?.(defaultAddr.id);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error(getErrorMessage(err));
      }
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSelect = (id) => {
    if (!selectable) return;
    setSelectedAddress(id);
    onSelect?.(id);
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(id);

      setAddresses((prev) => prev.filter((a) => a.id !== id));

      await deleteAddress(id);

      toast.success("Address deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
      fetchAddresses(); 
    } finally {
      setActionLoading(null);
    }
  };

  const handleDefault = async (id) => {
    try {
      setActionLoading(id);

      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );

      await setDefaultAddress(id);

      toast.success("Default address updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
      fetchAddresses();
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdd = async () => {
    try {
      setActionLoading("add");

      await addAddress(newAddress);

      toast.success("Address added");

      setShowModal(false);
      setNewAddress(initialState);

      fetchAddresses();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>My Addresses</h3>

        {allowAdd && (
          <button
            className={styles.addBtn}
            onClick={() => setShowModal(true)}
          >
            + Add Address
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {addresses.map((addr) => {
          const isSelected = selectedAddress === addr.id;

          return (
            <div
              key={addr.id}
              className={`${styles.card} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => handleSelect(addr.id)}
            >
              <div className={styles.top}>
                <span className={styles.type}>{addr.addressType}</span>

                <div className={styles.badges}>
                  {addr.isDefault && (
                    <span className={styles.default}>Default</span>
                  )}
                  {isSelected && (
                    <span className={styles.selectedTag}>Selected</span>
                  )}
                </div>
              </div>

              <div className={styles.text}>
                <p>{addr.street}</p>
                <p>{addr.landmark}</p>
                <p>{addr.city}, {addr.state}</p>
                <p>{addr.country} - {addr.pincode}</p>
                <p>📞 {addr.phone}</p>
              </div>

              {!selectable && (
                <div
                  className={styles.actions}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!addr.isDefault && (
                    <button onClick={() => handleDefault(addr.id)}>
                      {actionLoading === addr.id
                        ? "Updating..."
                        : "Set Default"}
                    </button>
                  )}

                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(addr.id)}
                  >
                    {actionLoading === addr.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add Address</h3>

            {[
              ["street", "Street *"],
              ["landmark", "Landmark *"],
              ["city", "City *"],
              ["state", "State"],
              ["country", "Country"],
              ["pincode", "Pincode *"],
              ["phone", "Phone *"],
            ].map(([key, label]) => (
              <div key={key} className={styles.field}>
                <label>{label}</label>
                <input
                  value={newAddress[key]}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      [key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div className={styles.field}>
              <label>Address Type</label>
              <div className={styles.typeSelector}>
                {["HOME", "WORK", "OTHER"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`${styles.typeBtn} ${
                      newAddress.addressType === type
                        ? styles.active
                        : ""
                    }`}
                    onClick={() =>
                      setNewAddress({
                        ...newAddress,
                        addressType: type,
                      })
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={handleAdd}>
                {actionLoading === "add" ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressSection;
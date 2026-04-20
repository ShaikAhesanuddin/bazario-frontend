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

function AddressSection({ selectable = false, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
    landmark: "",
    addressType: "HOME",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validate = () => {
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.pincode ||
      !newAddress.phone ||
      !newAddress.landmark
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (!/^\d{6}$/.test(newAddress.pincode)) {
      toast.error("Invalid pincode");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(newAddress.phone)) {
      toast.error("Invalid phone number");
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    try {
      setActionLoading("add");

      await addAddress(newAddress);

      toast.success("Address added");
      setShowModal(false);

      setNewAddress({
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        phone: "",
        landmark: "",
        addressType: "HOME",
        isDefault: false,
      });

      fetchAddresses();
    } catch {
      toast.error("Failed to add address");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      await deleteAddress(id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
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
      toast.success("Default updated");
    } catch {
      toast.error("Failed");
      fetchAddresses();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelect = (id) => {
    if (!selectable) return;

    setSelectedAddress(id);

    if (onSelect) {
      onSelect(id);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.wrapper}>
      
      <div className={styles.header}>
        <h3>My Addresses</h3>

        {!selectable && (
          <button
            onClick={() => setShowModal(true)}
            className={styles.addBtn}
          >
            + Add Address
          </button>
        )}
      </div>

      {!addresses.length && (
        <div className={styles.emptyState}>
          <p>No addresses added yet</p>
        </div>
      )}

      <div className={styles.grid}>
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`${styles.card} ${
              selectable && selectedAddress === addr.id
                ? styles.selected
                : ""
            }`}
            onClick={() => handleSelect(addr.id)}
          >
            <div className={styles.top}>
              <span className={styles.type}>{addr.addressType}</span>
              {addr.isDefault && (
                <span className={styles.default}>Default</span>
              )}
            </div>

            <div className={styles.text}>
              <p>{addr.street}</p>
              <p>{addr.landmark}</p>
              <p>
                {addr.city}, {addr.state}
              </p>
              <p>
                {addr.country} - {addr.pincode}
              </p>
              <p>📞 {addr.phone}</p>
            </div>

            {!selectable && (
              <div className={styles.actions}>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleDefault(addr.id)}
                    disabled={actionLoading === addr.id}
                  >
                    Set Default
                  </button>
                )}

                <button
                  className={styles.delete}
                  onClick={() => handleDelete(addr.id)}
                  disabled={actionLoading === addr.id}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!selectable && showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add Address</h3>

            <input
              placeholder="Street *"
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <input
              placeholder="Landmark *"
              onChange={(e) =>
                setNewAddress({ ...newAddress, landmark: e.target.value })
              }
            />
            <input
              placeholder="City *"
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <input
              placeholder="State"
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <input
              placeholder="Country"
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
            />
            <input
              placeholder="Pincode *"
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
            />
            <input
              placeholder="Phone *"
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />

            <select
              value={newAddress.addressType}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  addressType: e.target.value,
                })
              }
            >
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
              <option value="OTHER">Other</option>
            </select>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    isDefault: e.target.checked,
                  })
                }
              />
              Set as default
            </label>

            <div className={styles.modalActions}>
              <button onClick={handleAdd}>
                {actionLoading === "add" ? "Adding..." : "Save"}
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
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

function AddressSection({ selectable = false, onSelect, allowAdd = true }) {
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
      const data = res.data || [];
      setAddresses(data);

      if (selectable && data.length) {
        const defaultAddr = data.find(a => a.isDefault) || data[0];
        setSelectedAddress(defaultAddr.id);
        onSelect?.(defaultAddr.id);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error("Failed to load addresses");
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
      setAddresses(prev => prev.filter(a => a.id !== id));
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
      setAddresses(prev =>
        prev.map(a => ({ ...a, isDefault: a.id === id }))
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

  const handleAdd = async () => {
    try {
      setActionLoading("add");
      await addAddress(newAddress);
      toast.success("Address added");
      setShowModal(false);
      fetchAddresses();
    } catch {
      toast.error("Failed to add address");
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
        {addresses.map(addr => {
          const isSelected = selectedAddress === addr.id;

          return (
            <div
              key={addr.id}
              className={`${styles.card} ${isSelected ? styles.selected : ""}`}
              onClick={() => handleSelect(addr.id)}
            >
              <div className={styles.top}>
                <span className={styles.type}>
                  {addr.addressType}
                </span>

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
                      Set Default
                    </button>
                  )}

                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(addr.id)}
                  >
                    Delete
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

            <div className={styles.field}>
              <label>Street <span>*</span></label>
              <input onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label>Landmark <span>*</span></label>
              <input onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label>City <span>*</span></label>
              <input onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label>State</label>
              <input onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label>Country</label>
              <input onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label>Pincode <span>*</span></label>
              <input onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label>Phone <span>*</span></label>
              <input onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            </div>


            <div className={styles.field}>
              <label>Address Type</label>
              <select
                value={newAddress.addressType}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressType: e.target.value })
                }
              >
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button onClick={handleAdd}>
                {actionLoading === "add" ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressSection;
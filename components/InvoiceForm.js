import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoiceForm.module.scss";
import BackButton from "./BackButton";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

const states = [
  "AL (Alabama)",
  "AK (Alaska)",
  "AZ (Arizona)",
  "AR (Arkansas)",
  "CA (California)",
  "CO (Colorado)",
  "CT (Connecticut)",
  "DE (Delaware)",
  "DC (District of Columbia)",
  "FL (Florida)",
  "GA (Georgia)",
  "HI (Hawaii)",
  "ID (Idaho)",
  "IL (Illinois)",
  "IN (Indiana)",
  "IA (Iowa)",
  "KS (Kansas)",
  "KY (Kentucky)",
  "LA (Louisiana)",
  "ME (Maine)",
  "MD (Maryland)",
  "MA (Massachusetts)",
  "MI (Michigan)",
  "MN (Minnesota)",
  "MS (Mississippi)",
  "MT (Montana)",
  "NE (Nebraska)",
  "NV (Nevada)",
  "NH (New Hampshire)",
  "NJ (New Jersey)",
  "NM (New Mexico)",
  "NY (New York)",
  "NC (North Carolina)",
  "ND (North Dakota)",
  "OH (Ohio)",
  "OK (Oklahoma)",
  "OR (Oregon)",
  "PA (Pennsylvania)",
  "RI (Rhode Island)",
  "SC (South Carolina)",
  "SD (South Dakota)",
  "TN (Tennessee)",
  "TX (Texas)",
  "UT (Utah)",
  "VT (Vermont)",
  "VA (Virgina)",
  "WA (Washington)",
  "WV (West Virginia)",
  "WI (Wisconsin)",
  "WY (Wyoming)",
];

export default function InvoiceForm({
  handleDiscardNewInvoiceClick,
  hidden,
  selectedInvoice,
}) {
  const [senderStreet, setSenderStreet] = useState("");
  const [senderStreet2, setSenderStreet2] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [senderState, setSenderState] = useState("");
  const [senderZip, setSenderZip] = useState("");
  const [senderCountry, setSenderCountry] = useState("United States");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientStreet, setClientStreet] = useState("");
  const [clientStreet2, setClientStreet2] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientState, setClientState] = useState("");
  const [clientZip, setClientZip] = useState("");
  const [clientCountry, setClientCountry] = useState("United States");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [paymentTerms, setPaymentTerms] = useState(1);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (selectedInvoice) {
      setSenderStreet(selectedInvoice.senderStreet);
      setSenderStreet2(selectedInvoice.senderStreet2);
      setSenderCity(selectedInvoice.senderCity);
      setSenderState(selectedInvoice.senderState);
      setSenderZip(selectedInvoice.senderZip);
      setSenderCountry(selectedInvoice.senderCountry);
      setClientName(selectedInvoice.clientName);
      setClientEmail(selectedInvoice.clientEmail);
      setClientStreet(selectedInvoice.clientStreet);
      setClientStreet2(selectedInvoice.clientStreet2);
      setClientCity(selectedInvoice.clientCity);
      setClientState(selectedInvoice.clientState);
      setClientZip(selectedInvoice.clientZip);
      setClientCountry(selectedInvoice.clientCountry);
      setInvoiceDate(new Date(selectedInvoice.invoiceDate));
      setPaymentTerms(selectedInvoice.paymentTerms);
      setDescription(selectedInvoice.description);
      setItems(
        selectedInvoice.items.map((item) => {
          return {
            ...item,
            id: nanoid(),
          };
        })
      );
    }
  }, [selectedInvoice]);

  const prepareInvoiceObj = () => {
    return {
      description,
      senderStreet,
      senderStreet2,
      senderCity,
      senderState,
      senderZip,
      senderCountry,
      clientName,
      clientEmail,
      clientStreet,
      clientStreet2,
      clientCity,
      clientState,
      clientZip,
      clientCountry,
      invoiceDate,
      paymentTerms,
      items: items.map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    };
  };

  const saveAsDraft = async (e) => {
    e.preventDefault();
    const body = prepareInvoiceObj();
    try {
      if (selectedInvoice) {
        const response = await fetch(`/api/invoice/${selectedInvoice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(`Invoice #${jsonResponse.id} updated!`);
        }
      } else {
        const response = await fetch("/api/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(`Invoice #${jsonResponse.id} created!`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveAndSend = async (e) => {
    e.preventDefault();
    const body = {
      ...prepareInvoiceObj(),
      status: "PENDING",
    };
    try {
      if (selectedInvoice) {
        const response = await fetch(`/api/invoice/${selectedInvoice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(`Invoice #${jsonResponse.id} updated!`);
        }
      } else {
        const response = await fetch("/api/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(`Invoice #${jsonResponse.id} created!`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    const body = prepareInvoiceObj();
    try {
      const response = await fetch(`/api/invoice/${selectedInvoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(`Invoice #${jsonResponse.id} updated!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSenderStreetChange = (e) => {
    setSenderStreet(e.target.value);
  };

  const handleSenderStreet2Change = (e) => {
    setSenderStreet2(e.target.value);
  };

  const handleSenderCityChange = (e) => {
    setSenderCity(e.target.value);
  };

  const handleSenderZipChange = (e) => {
    setSenderZip(e.target.value);
  };

  const handleSenderCountryChange = (e) => {
    setSenderCountry(e.target.value);
  };

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
  };

  const handleClientEmailChange = (e) => {
    setClientEmail(e.target.value);
  };

  const handleClientStreetChange = (e) => {
    setClientStreet(e.target.value);
  };

  const handleClientStreet2Change = (e) => {
    setClientStreet2(e.target.value);
  };

  const handleClientCityChange = (e) => {
    setClientCity(e.target.value);
  };

  const handleClientZipChange = (e) => {
    setClientZip(e.target.value);
  };

  const handleClientCountryChange = (e) => {
    setClientCountry(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleItemValueChange = (e, itemId, property) => {
    e.preventDefault();
    setItems((prevState) => {
      return prevState.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          [property]: e.target.value,
          total:
            property === "quantity"
              ? e.target.value * item.price
              : property === "price"
              ? item.quantity * e.target.value
              : item.quantity * item.price,
        };
      });
    });
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems((prevState) => {
      return [
        ...prevState,
        {
          id: nanoid(),
          name: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ];
    });
  };

  const deleteItem = (e, itemId) => {
    e.preventDefault();
    setItems((prevState) => {
      return prevState.filter((item) => item.id !== itemId);
    });
  };

  return (
    <div className={`${styles.root} ${hidden ? styles.root_hidden : ""}`}>
      <div className={styles.back_button}>
        <BackButton handleClick={handleDiscardNewInvoiceClick} />
      </div>
      <form>
        <h1 className={styles.form_title}>New Invoice</h1>
        <fieldset>
          <p className={styles.fieldset_title}>BILL FROM</p>
          <div className={styles.label_input_container}>
            <label>Address 1</label>
            <input
              type="text"
              value={senderStreet}
              onChange={handleSenderStreetChange}
            />
          </div>
          <div className={styles.label_input_container}>
            <label>Address 2</label>
            <input
              type="text"
              value={senderStreet2}
              onChange={handleSenderStreet2Change}
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.city}`}>
            <label>City</label>
            <input
              type="text"
              value={senderCity}
              onChange={handleSenderCityChange}
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.state}`}>
            <label>State</label>
            <CustomSelect
              options={states}
              value={senderState}
              setValue={setSenderState}
              type="state"
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.zip}`}>
            <label>ZIP/Postal Code</label>
            <input
              type="text"
              value={senderZip}
              onChange={handleSenderZipChange}
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.country}`}>
            <label>Country</label>
            <input
              type="text"
              value={senderCountry}
              onChange={handleSenderCountryChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <p className={styles.fieldset_title}>BILL TO</p>
          <div className={styles.label_input_container}>
            <label>{"Client's Name"}</label>
            <input
              type="text"
              value={clientName}
              onChange={handleClientNameChange}
            />
          </div>
          <div className={styles.label_input_container}>
            <label>{"Client's Email"}</label>
            <input
              type="text"
              value={clientEmail}
              onChange={handleClientEmailChange}
            />
          </div>
          <div className={styles.label_input_container}>
            <label>Address 1</label>
            <input
              type="text"
              value={clientStreet}
              onChange={handleClientStreetChange}
            />
          </div>
          <div className={styles.label_input_container}>
            <label>Address 2</label>
            <input
              type="text"
              value={clientStreet2}
              onChange={handleClientStreet2Change}
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.city}`}>
            <label>City</label>
            <input
              type="text"
              value={clientCity}
              onChange={handleClientCityChange}
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.state}`}>
            <label>State</label>
            <CustomSelect
              options={states}
              value={clientState}
              setValue={setClientState}
              type="state"
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.zip}`}>
            <label>ZIP/Postal Code</label>
            <input
              type="text"
              value={clientZip}
              onChange={handleClientZipChange}
            />
          </div>
          <div className={`${styles.label_input_container} ${styles.country}`}>
            <label>Country</label>
            <input
              type="text"
              value={clientCountry}
              onChange={handleClientCountryChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <div className={`${styles.label_input_container} ${styles.date}`}>
            <label>Invoice Date</label>
            <CustomDatePicker date={invoiceDate} setDate={setInvoiceDate} />
          </div>
          <div className={`${styles.label_input_container} ${styles.terms}`}>
            <label>Payment Terms</label>
            <CustomSelect
              options={[1, 7, 14, 30]}
              value={paymentTerms}
              setValue={setPaymentTerms}
              type="terms"
            />
          </div>
          <div className={styles.label_input_container}>
            <label>Project Description</label>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
        </fieldset>
        <h2>Item List</h2>
        <ul className={styles.item_list}>
          {items.map((item) => (
            <li key={item.id}>
              <fieldset>
                <div
                  className={`${styles.label_input_container} ${styles.item_name}`}
                >
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemValueChange(e, item.id, "name")}
                  />
                </div>
                <div
                  className={`${styles.label_input_container} ${styles.item_quantity}`}
                >
                  <label>Qty.</label>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemValueChange(e, item.id, "quantity")
                    }
                  />
                </div>
                <div
                  className={`${styles.label_input_container} ${styles.item_price}`}
                >
                  <label>Price</label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => handleItemValueChange(e, item.id, "price")}
                  />
                </div>
                <div
                  className={`${styles.label_input_container} ${styles.item_total}`}
                >
                  <label>Total</label>
                  <p className={styles.item_total}>{item.total.toFixed(2)}</p>
                </div>
                <button
                  className={styles.delete_item_button}
                  onClick={(e) => deleteItem(e, item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </fieldset>
            </li>
          ))}
        </ul>
        <button onClick={addItem}>+ Add New Item</button>
      </form>
      {selectedInvoice && selectedInvoice.status !== "draft" ? (
        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={handleDiscardNewInvoiceClick}
          >
            Cancel
          </button>
          <button onClick={saveChanges} className={styles.save_changes}>
            Save Changes
          </button>
        </div>
      ) : (
        <div className={styles.actions}>
          <button
            className={styles.discard}
            onClick={handleDiscardNewInvoiceClick}
          >
            Discard
          </button>
          <button onClick={saveAsDraft} className={styles.save_as_draft}>
            Save as Draft
          </button>
          <button onClick={saveAndSend} className={styles.save_and_send}>
            {"Save & Send"}
          </button>
        </div>
      )}
    </div>
  );
}

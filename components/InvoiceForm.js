import {
  faPaperPlane,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoiceForm.module.scss";
import BackButton from "./BackButton";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

const states = [
  "NA (Outside USA)",
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedInvoice) {
      setSenderStreet(selectedInvoice.senderStreet);
      setSenderStreet2(selectedInvoice.senderStreet2);
      setSenderCity(selectedInvoice.senderCity);
      setSenderState(
        selectedInvoice.senderState === "BLANK"
          ? ""
          : selectedInvoice.senderState
      );
      setSenderZip(selectedInvoice.senderZip);
      setSenderCountry(selectedInvoice.senderCountry);
      setClientName(selectedInvoice.clientName);
      setClientEmail(selectedInvoice.clientEmail);
      setClientStreet(selectedInvoice.clientStreet);
      setClientStreet2(selectedInvoice.clientStreet2);
      setClientCity(selectedInvoice.clientCity);
      setClientState(
        selectedInvoice.clientState === "BLANK"
          ? ""
          : selectedInvoice.clientState
      );
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
      senderState: senderState === "" ? "BLANK" : senderState,
      senderZip,
      senderCountry,
      clientName,
      clientEmail,
      clientStreet,
      clientStreet2,
      clientCity,
      clientState: clientState === "" ? "BLANK" : clientState,
      clientZip,
      clientCountry,
      invoiceDate,
      paymentTerms,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
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
        const jsonResponse = await response.json();
        console.log(jsonResponse);
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
      let response;
      if (selectedInvoice) {
        response = await fetch(`/api/invoice/${selectedInvoice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        response = await fetch("/api/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      const jsonResponse = await response.json();
      if (response.ok) {
        console.log(
          `Invoice #${jsonResponse.id} ${
            selectedInvoice ? "updated" : "created"
          }!`
        );
      } else if (response.status === 400) {
        console.log(jsonResponse);
        setErrors(jsonResponse.errors);
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
      const jsonResponse = await response.json();
      if (response.ok) {
        console.log(`Invoice #${jsonResponse.id} updated!`);
      } else if (response.status === 400) {
        console.log(jsonResponse);
        setErrors(jsonResponse.errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSenderStreetChange = (e) => {
    setSenderStreet(e.target.value);
    if (errors.senderStreet) {
      setErrors((prevState) => {
        return {
          ...prevState,
          senderStreet: "",
        };
      });
    }
  };

  const handleSenderStreet2Change = (e) => {
    setSenderStreet2(e.target.value);
  };

  const handleSenderCityChange = (e) => {
    setSenderCity(e.target.value);
    if (errors.senderCity) {
      setErrors((prevState) => {
        return {
          ...prevState,
          senderCity: "",
        };
      });
    }
  };

  const handleSenderStateChange = (state) => {
    setSenderState(state);
    if (errors.senderState) {
      setErrors((prevState) => {
        return {
          ...prevState,
          senderState: "",
        };
      });
    }
  };

  const handleSenderZipChange = (e) => {
    setSenderZip(e.target.value);
    if (errors.senderZip) {
      setErrors((prevState) => {
        return {
          ...prevState,
          senderZip: "",
        };
      });
    }
  };

  const handleSenderCountryChange = (e) => {
    setSenderCountry(e.target.value);
    if (errors.senderCountry) {
      setErrors((prevState) => {
        return {
          ...prevState,
          senderCountry: "",
        };
      });
    }
  };

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
    if (errors.clientName) {
      setErrors((prevState) => {
        return {
          ...prevState,
          clientName: "",
        };
      });
    }
  };

  const handleClientEmailChange = (e) => {
    setClientEmail(e.target.value);
    if (errors.clientEmail) {
      setErrors((prevState) => {
        return {
          ...prevState,
          clientEmail: "",
        };
      });
    }
  };

  const handleClientStreetChange = (e) => {
    setClientStreet(e.target.value);
    if (errors.clientStreet) {
      setErrors((prevState) => {
        return {
          ...prevState,
          clientStreet: "",
        };
      });
    }
  };

  const handleClientStreet2Change = (e) => {
    setClientStreet2(e.target.value);
  };

  const handleClientCityChange = (e) => {
    setClientCity(e.target.value);
    if (errors.clientCity) {
      setErrors((prevState) => {
        return {
          ...prevState,
          clientCity: "",
        };
      });
    }
  };

  const handleClientStateChange = (state) => {
    setClientState(state);
    if (errors.clientCity) {
      setErrors((prevState) => {
        return {
          ...prevState,
          clientState: "",
        };
      });
    }
  };

  const handleClientZipChange = (e) => {
    setClientZip(e.target.value);
    if (errors.clientZip) {
      setErrors((prevState) => {
        return {
          ...prevState,
          clientZip: "",
        };
      });
    }
  };

  const handleClientCountryChange = (e) => {
    setClientCountry(e.target.value);
    if (errors.clientCountry) {
      setErrors((prevState) => {
        return {
          ...prevState,
          clientCountry: "",
        };
      });
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors((prevState) => {
        return {
          ...prevState,
          description: "",
        };
      });
    }
  };

  const handleInvoiceDateChange = (date) => {
    console.log(date);
    setInvoiceDate(date);
    if (errors.invoiceDate) {
      setErrors((prevState) => {
        return {
          ...prevState,
          invoiceDate: "",
        };
      });
    }
  };

  const handlePaymentTermsChange = (terms) => {
    setPaymentTerms(terms);
    if (errors.paymentTerms) {
      setErrors((prevState) => {
        return {
          ...prevState,
          paymentTerms: "",
        };
      });
    }
  };

  const handleItemValueChange = (e, itemId, property, index) => {
    e.preventDefault();
    setItems((prevState) => {
      return prevState.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          [property]:
            property === "name"
              ? e.target.value
              : isNaN(Number(e.target.value)) || e.target.value === ""
              ? 0
              : Number(e.target.value),
          total:
            property === "quantity"
              ? e.target.value * item.price
              : property === "price"
              ? item.quantity * e.target.value
              : item.quantity * item.price,
        };
      });
    });
    setErrors((prevState) => {
      return {
        ...prevState,
        [`item${index}`]: {
          ...prevState[`item${index}`],
          [property]: "",
        },
      };
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
    const updatedErrors = {};
    const deletedErrors = {};
    const itemIndex = items.findIndex((item) => item.id === itemId);
    //find item errors that have an item index greater than the deleted item's index and update their index to be 1 less than before
    Object.entries(errors)
      .filter(
        (entry) =>
          entry[0].slice(0, 4) === "item" &&
          Number(entry[0].slice(4)) > itemIndex
      )
      .forEach((entry) => {
        updatedErrors[`item${Number(entry[0].slice(4)) - 1}`] = entry[1];
      });
    // find item errors that have an index greater than or equal to the new amount of items (1 less than before) and remove these errors
    Object.entries(errors)
      .filter(
        (entry) =>
          entry[0].slice(0, 4) === "item" &&
          Number(entry[0].slice(4)) >= items.length - 1
      )
      .forEach((entry) => {
        deletedErrors[`item${entry[0].slice(4)}`] = {};
      });

    setErrors((prevState) => {
      return {
        ...prevState,
        ...updatedErrors,
        ...deletedErrors,
      };
    });

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
          <div
            className={`${styles.label_input_container} ${
              errors.senderStreet ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>Address 1</label>
              <p className={styles.error}>
                {errors.senderStreet ? errors.senderStreet : ""}
              </p>
            </div>
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
          <div
            className={`${styles.label_input_container} ${styles.city} ${
              errors.senderCity ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>City</label>
              <p className={styles.error}>
                {errors.senderCity ? errors.senderCity : ""}
              </p>
            </div>
            <input
              type="text"
              value={senderCity}
              onChange={handleSenderCityChange}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${styles.state} ${
              errors.senderState ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>State</label>
              <p className={styles.error}>
                {errors.senderState ? errors.senderState : ""}
              </p>
            </div>
            <CustomSelect
              options={states}
              value={senderState}
              handleValueChange={handleSenderStateChange}
              type="state"
              error={errors.senderState}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${styles.zip} ${
              errors.senderZip ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>ZIP/Postal Code</label>
              <p className={styles.error}>
                {errors.senderZip ? errors.senderZip : ""}
              </p>
            </div>
            <input
              type="text"
              value={senderZip}
              onChange={handleSenderZipChange}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${styles.country} ${
              errors.senderCountry
                ? styles.label_input_container_with_error
                : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>Country</label>
              <p className={styles.error}>
                {errors.senderCountry ? errors.senderCountry : ""}
              </p>
            </div>
            <input
              type="text"
              value={senderCountry}
              onChange={handleSenderCountryChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <p className={styles.fieldset_title}>BILL TO</p>
          <div
            className={`${styles.label_input_container} ${
              errors.clientName ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>{"Client's Name"}</label>
              <p className={styles.error}>
                {errors.clientName ? errors.clientName : ""}
              </p>
            </div>
            <input
              type="text"
              value={clientName}
              onChange={handleClientNameChange}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${
              errors.clientEmail ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>{"Client's Email"}</label>
              <p className={styles.error}>
                {errors.clientEmail ? errors.clientEmail : ""}
              </p>
            </div>
            <input
              type="text"
              value={clientEmail}
              onChange={handleClientEmailChange}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${
              errors.clientStreet ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>Address 1</label>
              <p className={styles.error}>
                {errors.clientStreet ? errors.clientStreet : ""}
              </p>
            </div>
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
          <div
            className={`${styles.label_input_container} ${styles.city} ${
              errors.clientCity ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>City</label>
              <p className={styles.error}>
                {errors.clientCity ? errors.clientCity : ""}
              </p>
            </div>
            <input
              type="text"
              value={clientCity}
              onChange={handleClientCityChange}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${styles.state} ${
              errors.clientState ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>State</label>
              <p className={styles.error}>
                {errors.clientState ? errors.clientState : ""}
              </p>
            </div>
            <CustomSelect
              options={states}
              value={clientState}
              handleValueChange={handleClientStateChange}
              type="state"
              error={errors.clientState}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${styles.zip} ${
              errors.clientZip ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>ZIP/Postal Code</label>
              <p className={styles.error}>
                {errors.clientZip ? errors.clientZip : ""}
              </p>
            </div>
            <input
              type="text"
              value={clientZip}
              onChange={handleClientZipChange}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${styles.country} ${
              errors.clientCountry
                ? styles.label_input_container_with_error
                : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>Country</label>
              <p className={styles.error}>
                {errors.clientCountry ? errors.clientCountry : ""}
              </p>
            </div>
            <input
              type="text"
              value={clientCountry}
              onChange={handleClientCountryChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <div
            className={`${styles.label_input_container} ${styles.date} ${
              errors.invoiceDate ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>Invoice Date</label>
              <p className={styles.error}>
                {errors.invoiceDate ? errors.invoiceDate : ""}
              </p>
            </div>
            <CustomDatePicker
              date={invoiceDate}
              handleDateChange={handleInvoiceDateChange}
              error={errors.invoiceDate}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${styles.terms} ${
              errors.paymentTerms ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>Payment Terms</label>
              <p className={styles.error}>
                {errors.paymentTerms ? errors.paymentTerms : ""}
              </p>
            </div>
            <CustomSelect
              options={[1, 7, 14, 30]}
              value={paymentTerms}
              handleValueChange={handlePaymentTermsChange}
              type="terms"
              error={errors.paymentTerms}
            />
          </div>
          <div
            className={`${styles.label_input_container} ${
              errors.description ? styles.label_input_container_with_error : ""
            }`}
          >
            <div className={styles.label_error_container}>
              <label>Project Description</label>
              <p className={styles.error}>
                {errors.description ? errors.description : ""}
              </p>
            </div>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
        </fieldset>
        <div className={styles.items_header_error_container}>
          <h2>Item List</h2>
          <p className={styles.error}>{errors.items ? errors.items : ""}</p>
        </div>
        <ul className={styles.item_list}>
          {items.map((item, index) => (
            <li key={item.id}>
              <fieldset>
                <div
                  className={`${styles.label_input_container} ${
                    styles.item_name
                  } ${
                    errors[`item${index}`] && errors[`item${index}`].name
                      ? styles.label_input_container_with_error
                      : ""
                  }`}
                >
                  <div className={styles.label_error_container}>
                    <label>Item Name</label>
                    <p className={styles.error}>
                      {`${
                        errors[`item${index}`] && errors[`item${index}`].name
                          ? errors[`item${index}`].name
                          : ""
                      }`}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemValueChange(e, item.id, "name", index)
                    }
                  />
                </div>
                <div
                  className={`${styles.label_input_container} ${
                    styles.item_quantity
                  } ${
                    errors[`item${index}`] && errors[`item${index}`].quantity
                      ? styles.label_input_container_with_error
                      : ""
                  }`}
                >
                  <div className={styles.label_error_container}>
                    <label>Qty.</label>
                    <p className={styles.error}>
                      {`${
                        errors[`item${index}`] &&
                        errors[`item${index}`].quantity
                          ? errors[`item${index}`].quantity
                          : ""
                      }`}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemValueChange(e, item.id, "quantity", index)
                    }
                  />
                </div>
                <div
                  className={`${styles.label_input_container} ${
                    styles.item_price
                  } ${
                    errors[`item${index}`] && errors[`item${index}`].price
                      ? styles.label_input_container_with_error
                      : ""
                  }`}
                >
                  <div className={styles.label_error_container}>
                    <label>Price</label>
                    <p className={styles.error}>
                      {`${
                        errors[`item${index}`] && errors[`item${index}`].price
                          ? errors[`item${index}`].price
                          : ""
                      }`}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) =>
                      handleItemValueChange(e, item.id, "price", index)
                    }
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
            <span>Cancel</span>
          </button>
          <button onClick={saveChanges} className={styles.save_changes}>
            <span>Save Changes</span>
          </button>
        </div>
      ) : (
        <div className={styles.actions}>
          <button
            className={styles.discard}
            onClick={handleDiscardNewInvoiceClick}
          >
            <FontAwesomeIcon icon={faTrash} className={styles.icon} />
            <span>Discard</span>
          </button>
          <button onClick={saveAsDraft} className={styles.save_as_draft}>
            <FontAwesomeIcon icon={faSave} className={styles.icon} />
            <span>Save as Draft</span>
          </button>
          <button onClick={saveAndSend} className={styles.save_and_send}>
            <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} />
            <span>Save &amp; Send</span>
          </button>
        </div>
      )}
    </div>
  );
}

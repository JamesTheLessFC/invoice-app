import styles from "../styles/Invoice.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import ModalScreen from "./ModalScreen";
import DeleteModal from "./DeleteModal";
import { useRouter } from "next/router";

export default function Invoice({
  data,
  deselectInvoice,
  handleEditInvoiceClick,
  showInvoiceForm,
}) {
  const [hideDeleteModal, setHideDeleteModal] = useState(false);
  const [hideModalScreen, setHideModalScreen] = useState(true);

  useEffect(() => {
    if (hideDeleteModal) {
      setTimeout(() => {
        setHideModalScreen(true);
      }, 500);
    }
  }, [hideDeleteModal]);

  const deleteInvoice = async () => {
    const response = await fetch(`/api/invoice/${data.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(`Invoice #${jsonResponse.id} deleted!`);
      deselectInvoice();
      setHideDeleteModal(true);
    }
  };

  const handleDeleteClick = () => {
    setHideModalScreen(false);
    setHideDeleteModal(false);
  };

  const handleCancelDeleteClick = () => {
    setHideDeleteModal(true);
  };

  return (
    <div
      className={`${styles.root} ${
        showInvoiceForm ? styles.root_with_invoice_form : ""
      }`}
    >
      <BackButton handleClick={deselectInvoice} />
      <div className={`${styles.container} ${styles.container_status}`}>
        <p className={styles.label}>Status</p>
        <p className={`${styles.status} ${styles[`status_${data.status}`]}`}>
          <FontAwesomeIcon icon={faCircle} className={styles.icon} size="xs" />
          <span>&nbsp;&nbsp;{data.status}</span>
        </p>
        <div className={styles.actions}>
          <button onClick={handleEditInvoiceClick}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
          <button>Mark as Paid</button>
        </div>
      </div>
      <div className={styles.container}>
        <div>
          <div>
            <p className={styles.id}>
              <span>#</span>
              {data.id}
            </p>
            <p className={styles.description}>{data.description}</p>
          </div>
          <div className={styles.address}>
            <p>{data.senderStreet}</p>
            <p>{data.senderCity}</p>
            <p>{data.senderZip}</p>
            <p>{data.senderCountry}</p>
          </div>
        </div>
        <div className={styles.details}>
          <div>
            <p className={styles.label}>Invoice Date</p>
            <p>{data.invoiceDate}</p>
            <p className={styles.label}>Payment Due</p>
            <p>{data.paymentDue}</p>
            <div className={styles.client_email}>
              <p className={styles.label}>Send To</p>
              <p>{data.clientEmail}</p>
            </div>
          </div>
          <div>
            <p className={styles.label}>Bill To</p>
            <p>{data.clientName}</p>
            <div className={styles.address}>
              <p>{data.clientStreet}</p>
              <p>{data.clientCity}</p>
              <p>{data.clientZip}</p>
              <p>{data.clientCountry}</p>
            </div>
          </div>
        </div>
        <div className={styles.breakdown}>
          <ul>
            <li className={styles.list_headings}>
              <div>
                <p>Item Name</p>
                <p className={styles.item_quantity_price}>
                  <span className={styles.item_quantity}>QTY.</span>
                  <span className={styles.item_price}>Price</span>
                </p>
              </div>
              <div>
                <p>Total</p>
              </div>
            </li>
            {data.items.map((item) => (
              <li key={item.id}>
                <div>
                  <p>{item.name}</p>
                  <p className={styles.item_quantity_price}>
                    <span className={styles.item_quantity}>
                      {item.quantity}
                      <span>x </span>
                    </span>
                    <span className={styles.item_price}>
                      {item.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </p>
                </div>
                <div>
                  <p>
                    {item.total.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p>Grand Total</p>
            <p>
              {data.total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </div>
      {!hideModalScreen && (
        <ModalScreen>
          <DeleteModal
            hidden={hideDeleteModal}
            handleCancelDeleteClick={handleCancelDeleteClick}
            deleteInvoice={deleteInvoice}
          />
        </ModalScreen>
      )}
    </div>
  );
}

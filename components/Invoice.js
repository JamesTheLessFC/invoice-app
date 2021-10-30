import styles from "../styles/Invoice.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import ModalScreen from "./ModalScreen";
import DeleteModal from "./DeleteModal";
import { useUpdateInvoiceByIdMutation } from "../services/invoice";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { selectToast, showToast } from "../features/toast/toastSlice";
import { selectInvoiceForm } from "../features/invoiceForm/invoiceFormSlice";

export default function Invoice({ data, handleEditInvoiceClick }) {
  const [hideDeleteModal, setHideDeleteModal] = useState(false);
  const [hideModalScreen, setHideModalScreen] = useState(true);
  const [updateInvoiceById, { isLoading: isUpdating }] =
    useUpdateInvoiceByIdMutation();
  const router = useRouter();
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();
  const invoiceForm = useSelector(selectInvoiceForm);

  useEffect(() => {
    if (hideDeleteModal) {
      setTimeout(() => {
        setHideModalScreen(true);
      }, 500);
    }
  }, [hideDeleteModal]);

  const markAsPaid = async () => {
    const body = { id: data.id, status: "PAID" };
    try {
      const response = await updateInvoiceById(body).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: `Invoice #${response.id
            .slice(-8)
            .toUpperCase()} marked as paid!`,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({ type: "error", message: "Oops! Something went wrong." })
      );
    }
  };

  const handleDeleteClick = () => {
    setHideModalScreen(false);
    setHideDeleteModal(false);
  };

  const cancelDelete = () => {
    setHideDeleteModal(true);
  };

  return (
    <div
      className={`${styles.root} ${
        invoiceForm.open ? styles.root_with_invoice_form : ""
      }`}
    >
      <BackButton handleClick={() => router.push("/invoices")} />
      <div className={`${styles.container} ${styles.container_status}`}>
        <p className={styles.label}>Status</p>
        <p className={`${styles.status} ${styles[`status_${data.status}`]}`}>
          <FontAwesomeIcon icon={faCircle} className={styles.icon} size="xs" />
          <span>&nbsp;&nbsp;{data.status}</span>
        </p>
        <div className={styles.actions}>
          <button onClick={handleEditInvoiceClick}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
          <button onClick={markAsPaid} disabled={isUpdating}>
            {isUpdating ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Mark as Paid"
            )}
          </button>
        </div>
      </div>
      <div className={styles.container}>
        <div>
          <div>
            <p className={styles.id}>
              <span>#</span>
              {data.id.toUpperCase()}
            </p>
            <p className={styles.description}>{data.description}</p>
          </div>
          <div className={styles.address}>
            <p>{data.senderStreet}</p>
            <p>{data.senderStreet2}</p>
            <p>
              {data.senderCity}
              {data.senderState &&
              data.senderState != "BLANK" &&
              data.senderState != "NA"
                ? ", " + data.senderState
                : ""}
            </p>
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
              <p>{data.clientStreet2}</p>
              <p>
                {data.clientCity}
                {data.clientState &&
                data.clientState != "BLANK" &&
                data.clientState != "NA"
                  ? ", " + data.clientState
                  : ""}
              </p>
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
            cancelDelete={cancelDelete}
            invoiceId={data.id}
          />
        </ModalScreen>
      )}
    </div>
  );
}

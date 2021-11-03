import styles from "../styles/Invoice.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import BackButton from "./BackButton";
import ModalScreen from "./ModalScreen";
import DeleteModal from "./DeleteModal";
import { usePatchInvoiceByIdMutation } from "../services/invoice";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { selectToast, showToast } from "../features/toast/toastSlice";
import {
  selectInvoiceForm,
  showInvoiceForm,
} from "../features/invoiceForm/invoiceFormSlice";
import {
  selectDeleteModal,
  showDeleteModal,
} from "../features/deleteModal/deleteModalSlice";
import { selectInvoiceList } from "../features/invoiceList/invoiceListSlice";
import { selectDarkMode } from "../features/darkMode/darkModeSlice";

export default function Invoice({ data }) {
  const [patchInvoiceById, { isLoading: isUpdating }] =
    usePatchInvoiceByIdMutation();
  const router = useRouter();
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();
  const invoiceForm = useSelector(selectInvoiceForm);
  const deleteModal = useSelector(selectDeleteModal);
  const invoiceList = useSelector(selectInvoiceList);
  const darkMode = useSelector(selectDarkMode);

  const toggleStatus = async () => {
    const body = {
      id: data.id,
      status: data.status === "pending" ? "PAID" : "PENDING",
    };
    try {
      const response = await patchInvoiceById(body).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: `Invoice #${response.id.slice(-8).toUpperCase()} marked as ${
            data.status === "pending" ? "paid" : "pending"
          }!`,
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
    dispatch(showDeleteModal());
  };

  const handleBackClick = () => {
    const selectedFilters = invoiceList.filters;
    const page = invoiceList.page;
    router.push(
      `/invoices?${
        selectedFilters.length > 0
          ? `filter=${
              selectedFilters.length > 1
                ? selectedFilters.join(",")
                : selectedFilters[0]
            }&`
          : ""
      }page=${page}`
    );
  };

  return (
    <div
      className={`${styles.root} ${
        invoiceForm.open ? styles.root_with_invoice_form : ""
      } ${darkMode.on ? styles.root_dark : ""}`}
    >
      <BackButton handleClick={handleBackClick} />
      <div className={`${styles.container} ${styles.container_status}`}>
        <p className={styles.label}>Status</p>
        <p className={`${styles.status} ${styles[`status_${data.status}`]}`}>
          <FontAwesomeIcon icon={faCircle} className={styles.icon} size="xs" />
          <span>&nbsp;&nbsp;{data.status}</span>
        </p>
        <div className={styles.actions}>
          <button onClick={() => dispatch(showInvoiceForm())}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
          <button
            onClick={toggleStatus}
            disabled={isUpdating || data.status === "draft"}
          >
            {isUpdating ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : data.status === "paid" ? (
              "Mark as Pending"
            ) : (
              "Mark as Paid"
            )}
          </button>
        </div>
      </div>
      <div className={styles.container}>
        <div>
          <div>
            <h2 className={styles.id}>
              <span>#</span>
              {data.id.slice(-8).toUpperCase()}
            </h2>
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
          <div className={styles.total_container}>
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
      {deleteModal.open && (
        <ModalScreen>
          <DeleteModal invoiceId={data.id} />
        </ModalScreen>
      )}
    </div>
  );
}

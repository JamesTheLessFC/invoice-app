import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoicesHeader.module.scss";
import InvoicesFilter from "./InvoicesFilter";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInvoiceForm,
  showInvoiceForm,
} from "../features/invoiceForm/invoiceFormSlice";
import { selectInvoiceList } from "../features/invoiceList/invoiceListSlice";

export default function InvoicesHeader() {
  const invoiceForm = useSelector(selectInvoiceForm);
  const invoiceList = useSelector(selectInvoiceList);
  const dispatch = useDispatch();

  return (
    <div
      className={`${styles.root} ${
        invoiceForm.open ? styles.root_with_form : ""
      }`}
    >
      <div className={styles.align_left}>
        <h2>Invoices</h2>
        <p>
          {invoiceList.invoiceCount} Invoice
          {invoiceList.invoiceCount !== 1 ? "s" : ""}
        </p>
      </div>
      <InvoicesFilter />
      <button
        className={styles.button_add}
        onClick={() => dispatch(showInvoiceForm())}
      >
        <span className={styles.icon}>
          <FontAwesomeIcon icon={faPlus} />
        </span>
        Add
      </button>
    </div>
  );
}

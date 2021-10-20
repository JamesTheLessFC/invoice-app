import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoicesHeader.module.scss";
import InvoicesFilter from "./InvoicesFilter";

export default function InvoicesHeader({
  filter,
  filterOptions,
  handleFilterSelect,
  invoiceCount,
  showInvoiceForm,
  handleAddNewInvoiceClick,
}) {
  return (
    <div
      className={`${styles.root} ${
        showInvoiceForm ? styles.root_with_form : ""
      }`}
    >
      <div className={styles.align_left}>
        <h2>Invoices</h2>
        <p>{invoiceCount} Invoices</p>
      </div>
      <InvoicesFilter
        filter={filter}
        filterOptions={filterOptions}
        handleFilterSelect={handleFilterSelect}
      />
      <button className={styles.button_add} onClick={handleAddNewInvoiceClick}>
        <span className={styles.icon}>
          <FontAwesomeIcon icon={faPlus} />
        </span>
        Add
      </button>
    </div>
  );
}

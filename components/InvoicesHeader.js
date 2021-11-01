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

  const getInvoiceCountLine = () => {
    const count = invoiceList.invoiceCount;
    const page = invoiceList.page;
    const max = 10;
    const lastPage = Math.ceil(count / max) === page;
    const firstOnPage = max * page - (max - 1);
    const lastOnPage = lastPage ? count : firstOnPage + max - 1;
    return `${firstOnPage}${
      lastOnPage !== firstOnPage ? `-${lastOnPage}` : ""
    } of ${count}`;
  };

  return (
    <div
      className={`${styles.root} ${
        invoiceForm.open ? styles.root_with_form : ""
      }`}
    >
      <div className={styles.align_left}>
        <h2>Invoices</h2>
        <p>{getInvoiceCountLine()}</p>
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

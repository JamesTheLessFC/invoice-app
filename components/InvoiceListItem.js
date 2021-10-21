import { faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoiceListItem.module.scss";

export default function InvoiceListItem({ data, selectInvoice }) {
  return (
    <li className={styles.root} onClick={() => selectInvoice(data)}>
      <p className={styles.id}>
        <span>#</span>
        {data.id.slice(0, 5).toUpperCase()}...
      </p>
      <p className={styles.due_date}>Due {data.paymentDue}</p>
      <p className={styles.client_name}>{data.clientName}</p>
      <h3 className={styles.total}>
        {data.total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </h3>
      <p className={`${styles.status} ${styles[`status_${data.status}`]}`}>
        <FontAwesomeIcon icon={faCircle} className={styles.icon} size="xs" />
        <span>&nbsp;&nbsp;{data.status}</span>
      </p>
      <button className={styles.open_button}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </li>
  );
}

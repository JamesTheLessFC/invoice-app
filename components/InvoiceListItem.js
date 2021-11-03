import { faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoiceListItem.module.scss";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../features/darkMode/darkModeSlice";

export default function InvoiceListItem({ data }) {
  const router = useRouter();
  const darkMode = useSelector(selectDarkMode);

  return (
    <li
      className={`${styles.root} ${darkMode.on ? styles.root_dark : ""}`}
      onClick={() => router.push(`/invoice/${data.id}`)}
    >
      <p className={styles.id}>
        <span>#</span>
        {data.id.slice(-8).toUpperCase()}
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

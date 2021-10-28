import styles from "../styles/Toast.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Toast({ type, hideToast, closeToast, message }) {
  return (
    <div
      className={`${styles.root} ${
        type === "success"
          ? styles.root_success
          : type === "error"
          ? styles.root_error
          : ""
      } ${hideToast ? styles.root_hidden : ""}`}
    >
      <div>
        <FontAwesomeIcon
          icon={type === "success" ? faCheckCircle : faExclamationCircle}
          className={styles.icon}
        />
        <p>{message}</p>
        <button onClick={closeToast}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}

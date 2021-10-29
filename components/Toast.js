import styles from "../styles/Toast.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectToast, hideToast } from "../features/toast/toastSlice";

export default function Toast() {
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();

  return (
    <div
      className={`${styles.root} ${
        toast.type === "success"
          ? styles.root_success
          : toast.type === "error"
          ? styles.root_error
          : ""
      } ${toast.hidden ? styles.root_hidden : ""}`}
    >
      <div>
        <FontAwesomeIcon
          icon={toast.type === "success" ? faCheckCircle : faExclamationCircle}
          className={styles.icon}
        />
        <p>{toast.message}</p>
        <button onClick={() => dispatch(hideToast())}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}

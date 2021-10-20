import styles from "../styles/BackButton.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackButton({ handleClick }) {
  return (
    <button className={styles.root} onClick={handleClick}>
      <span>
        <FontAwesomeIcon icon={faChevronLeft} />
      </span>
      Go back
    </button>
  );
}

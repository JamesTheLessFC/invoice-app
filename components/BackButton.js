import styles from "../styles/BackButton.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../features/darkMode/darkModeSlice";

export default function BackButton({ handleClick }) {
  const darkMode = useSelector(selectDarkMode);

  return (
    <button
      className={`${styles.root} ${darkMode.on ? styles.root_dark : ""}`}
      onClick={handleClick}
    >
      <span>
        <FontAwesomeIcon icon={faChevronLeft} />
      </span>
      Go back
    </button>
  );
}

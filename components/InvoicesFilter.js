import {
  faCheck,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoicesFilter.module.scss";
import { useState, useEffect } from "react";

export default function InvoicesFilter({
  filter,
  filterOptions,
  handleFilterSelect,
}) {
  const [hideOptions, setHideOptions] = useState(true);

  useEffect(() => {
    if (!hideOptions) {
      const handleOutsideClick = () => {
        setHideOptions(true);
      };
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [hideOptions]);

  const toggleOptions = (e) => {
    e.stopPropagation();
    setHideOptions((prevState) => {
      return !prevState;
    });
  };

  return (
    <div className={styles.root}>
      <span>Filter</span>
      <button className={styles.toggle_button} onClick={toggleOptions}>
        <FontAwesomeIcon icon={hideOptions ? faChevronDown : faChevronUp} />
      </button>
      <ul className={hideOptions ? styles.hidden : ""}>
        {filterOptions.map((option) => (
          <li key={option}>
            <button
              className={styles.option_button}
              onClick={(e) => handleFilterSelect(e, option)}
            >
              <span
                className={`${styles.checkbox} ${
                  filter.includes(option) ? styles.checkbox_checked : ""
                }`}
              >
                <FontAwesomeIcon icon={faCheck} className={styles.check} />
              </span>
              <span>{option}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

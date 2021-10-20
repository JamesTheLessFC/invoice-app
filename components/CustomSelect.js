import styles from "../styles/CustomSelect.module.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function CustomSelect({ options, value, setValue }) {
  const [hideOptions, setHideOptions] = useState(true);

  useEffect(() => {
    if (!hideOptions) {
      const handleOutsideClick = () => {
        setHideOptions(true);
      };
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      }, 0);
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [hideOptions]);

  const toggleOptions = (e) => {
    e.preventDefault();
    setHideOptions((prevState) => {
      return !prevState;
    });
  };

  const handleOptionClick = (e, option) => {
    e.preventDefault();
    //e.stopPropagation();
    setValue(option);
  };

  return (
    <div className={`${styles.root} ${hideOptions ? "" : styles.root_focused}`}>
      <span>
        Net {value} {value === 1 ? "Day" : "Days"}
      </span>
      <button className={styles.toggleOptionsButton} onClick={toggleOptions}>
        <FontAwesomeIcon icon={hideOptions ? faChevronDown : faChevronUp} />
      </button>
      <ul className={hideOptions ? styles.hidden : ""}>
        {options.map((option) => (
          <li key={option}>
            <button
              onClick={(e) => handleOptionClick(e, option)}
              className={value === option ? styles.active : ""}
            >
              Net {option} {option === 1 ? "Day" : "Days"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

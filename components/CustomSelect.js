import styles from "../styles/CustomSelect.module.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function CustomSelect({ options, value, setValue, type }) {
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
    if (type !== "state") {
      setValue(option);
    } else {
      setValue(option.split(" ")[0]);
    }
  };

  return (
    <div className={`${styles.root} ${hideOptions ? "" : styles.root_focused}`}>
      {type === "terms" ? (
        <span>
          Net {value} {value === 1 ? "Day" : "Days"}
        </span>
      ) : (
        <span>{value === "" ? "--" : value}</span>
      )}
      <button className={styles.toggleOptionsButton} onClick={toggleOptions}>
        <FontAwesomeIcon icon={hideOptions ? faChevronDown : faChevronUp} />
      </button>
      <div
        className={`${styles.options_container} ${
          type === "terms" ? styles.options_container_terms : ""
        }`}
      >
        <ul
          className={`${styles.options} ${
            hideOptions ? styles.options_hidden : ""
          } ${type === "terms" ? styles.options_terms : ""}`}
        >
          {options.map((option) => (
            <li key={option}>
              <button
                onClick={(e) => handleOptionClick(e, option)}
                className={value === option ? styles.active : ""}
              >
                {type === "terms" ? (
                  <span>
                    Net {option} {option === 1 ? "Day" : "Days"}
                  </span>
                ) : (
                  <span>{option}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

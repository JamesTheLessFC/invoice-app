import styles from "../styles/CustomSelect.module.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../features/darkMode/darkModeSlice";

export default function CustomSelect({
  options,
  value,
  handleValueChange,
  type,
  error,
}) {
  const [hideOptions, setHideOptions] = useState(true);
  const darkMode = useSelector(selectDarkMode);

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
      handleValueChange(option);
    } else {
      handleValueChange(option.split(" ")[0]);
    }
  };

  return (
    <div
      className={`${styles.root} ${hideOptions ? "" : styles.root_focused} ${
        error ? styles.root_with_error : ""
      } ${darkMode.on ? styles.root_dark : ""}`}
    >
      {type === "terms" ? (
        <span>
          Net {value} {value === 1 ? "Day" : "Days"}
        </span>
      ) : (
        <span>{value === "" ? "--" : value === "NA" ? "N/A" : value}</span>
      )}
      <button className={styles.toggle_options_button} onClick={toggleOptions}>
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
                  <span>
                    {option === "NA (Outside USA)"
                      ? "N/A (Outside USA)"
                      : option}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
